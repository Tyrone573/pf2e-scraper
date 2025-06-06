import axios from 'axios';
import { createTrait } from '../api/traits';

export class TraitsScraper {
  private readonly ELASTIC_URL = 'https://elasticsearch.aonprd.com/aon/_search';

  public async fetchAndSaveAllTraits(): Promise<void> {
    try {
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
      let upserted = 0;
      for (const hit of hits) {
        const trait = hit._source;
        const {
          name = null,
          description = null,
          source = 'Archives of Nethys',
          url,
          is_legacy = false,
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
          is_legacy,
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
        });
        if (created) {
          upserted++;
        } else {
          console.error(`[TraitsScraper] Error creating trait ${name}`);
        }
      }
      console.log(`[TraitsScraper] Created ${upserted} traits in Supabase.`);
    } catch (error) {
      console.error('[TraitsScraper] Error fetching or saving traits:', error);
      throw error;
    }
  }
} 