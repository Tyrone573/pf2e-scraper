import axios from 'axios';
import { createTrait } from '../api/traits';
import { supabase } from '../lib/supabase';

export class TraitsScraper {
  private readonly ELASTIC_URL = 'https://elasticsearch.aonprd.com/aon/_search';

  public async fetchAndSaveAllTraits(): Promise<void> {
    try {
      const scrapeStart = new Date().toISOString();
      console.log('[TraitsScraper] Fetching all traits from Elasticsearch...');
      const response = await axios.post(this.ELASTIC_URL, {
        from: 0,
        size: 10000,
        query: { match: { category: 'trait' } },
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000,
      });
      const hits = response.data?.hits?.hits || [];
      console.log(`[TraitsScraper] Retrieved ${hits.length} traits from Elasticsearch.`);
      if (hits.length === 0) {
        throw new Error('No traits were fetched from the source. Aborting update.');
      }
      // Identify duplicates by name
      const traitsByName: Record<string, any[]> = {};
      for (const hit of hits) {
        const trait = hit._source;
        if (!traitsByName[trait.name]) traitsByName[trait.name] = [];
        traitsByName[trait.name].push(trait);
      }
      // For each set of duplicates, mark the newest as is_replaced = false, others as true
      for (const name in traitsByName) {
        const group = traitsByName[name];
        if (group.length === 1) {
          group[0].is_replaced = false;
        } else {
          group.sort((a, b) => (b.release_date || '') > (a.release_date || '') ? 1 : -1);
          group.forEach((trait, idx) => {
            trait.is_replaced = idx !== 0;
          });
        }
      }
      // Insert new traits
      let upserted = 0;
      for (const hit of hits) {
        const trait = hit._source;
        // Set is_legacy true if release_date is before 2023-04-27
        let legacyFlag = trait.is_legacy;
        if (trait.release_date) {
          const LEGACY_CUTOFF = new Date('2023-04-27');
          const releaseDate = new Date(trait.release_date);
          if (!isNaN(releaseDate.getTime()) && releaseDate < LEGACY_CUTOFF) {
            legacyFlag = true;
          }
        }
        const {
          name = null,
          description = null,
          source = 'Archives of Nethys',
          url,
          primary_source,
          primary_source_raw,
          primary_source_category,
          rarity,
          rarity_id,
          release_date,
          summary,
          trait_group,
          trait_markdown,
          trait_raw,
          type,
          category,
          source_raw,
          source_category,
          source_markdown,
          search_markdown,
          markdown,
          summary_markdown,
          text,
        } = trait;
        const created = await createTrait({
          elastic_id: hit.id,
          name,
          description,
          source: Array.isArray(source) ? source[0] : source,
          source_url: url,
          is_legacy: legacyFlag,
          primary_source,
          primary_source_raw,
          primary_source_category,
          rarity,
          rarity_id,
          release_date,
          summary,
          trait_group: Array.isArray(trait_group) ? trait_group : trait_group ? [trait_group] : [],
          trait_markdown,
          trait_raw: Array.isArray(trait_raw) ? trait_raw : trait_raw ? [trait_raw] : [],
          type,
          url,
          category: Array.isArray(category) ? category : category ? [category] : [],
          source_raw: Array.isArray(source_raw) ? source_raw : source_raw ? [source_raw] : [],
          source_category: Array.isArray(source_category) ? source_category : source_category ? [source_category] : [],
          source_markdown,
          search_markdown,
          markdown,
          summary_markdown,
          text,
          is_replaced: trait.is_replaced,
        });
        if (created) {
          upserted++;
        } else {
          console.error(`[TraitsScraper] Error creating trait ${name}`);
        }
      }
      console.log(`[TraitsScraper] Created ${upserted} traits in Supabase.`);
      // Delete all traits that existed before this scrape
      console.log('[TraitsScraper] Deleting old traits from previous scrapes...');
      const { error: deleteError, count } = await supabase
        .from('traits')
        .delete({ count: 'exact' })
        .lt('created_at', scrapeStart);
      if (deleteError) {
        throw new Error(`[TraitsScraper] Failed to delete old traits: ${deleteError.message}`);
      }
      console.log(`[TraitsScraper] Deleted ${count ?? 0} old traits from previous scrapes.`);
    } catch (error) {
      console.error('[TraitsScraper] Error fetching or saving traits:', error);
      throw error;
    }
  }
} 