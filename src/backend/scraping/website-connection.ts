import axios from 'axios';
import { RateLimit } from 'async-sema';
import parse from 'robots-parser';
import { supabase } from '../lib/supabase';
import { TABLES } from '../../config/supabase';

// Rate limiting configuration
const REQUESTS_PER_SECOND = 2; // Adjust based on website's requirements
const rateLimiter = RateLimit(REQUESTS_PER_SECOND);

// Base URL for Pathfinder 2E website
const BASE_URL = 'https://2e.aonprd.com';

// Cache for robots.txt rules
let robotsRules: any = null;

export class WebsiteConnection {
  private static instance: WebsiteConnection;
  private lastRequestTime: number = 0;
  private minDelayBetweenRequests: number = 1000 / REQUESTS_PER_SECOND;

  private constructor() {}

  public static getInstance(): WebsiteConnection {
    if (!WebsiteConnection.instance) {
      WebsiteConnection.instance = new WebsiteConnection();
    }
    return WebsiteConnection.instance;
  }

  private async ensureRobotsRules(): Promise<void> {
    if (!robotsRules) {
      try {
        const response = await axios.get(`${BASE_URL}/robots.txt`);
        robotsRules = parse(response.data, BASE_URL);
      } catch (error) {
        console.error('Error fetching robots.txt:', error);
        // Default to conservative rules if robots.txt can't be fetched
        robotsRules = {
          isAllowed: () => false,
          getCrawlDelay: () => 1,
        };
      }
    }
  }

  private async respectRateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minDelayBetweenRequests) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minDelayBetweenRequests - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  public async fetchPage(url: string): Promise<string> {
    await this.ensureRobotsRules();
    
    // Check if URL is allowed by robots.txt
    if (!robotsRules.isAllowed(url)) {
      throw new Error(`URL ${url} is not allowed by robots.txt`);
    }

    // Respect rate limiting
    await this.respectRateLimit();
    await rateLimiter();

    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
        },
        timeout: 10000, // 10 second timeout
      });

      // Update last scraped time in sources table
      await this.updateLastScrapedTime(url);

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          // Too many requests - increase delay
          this.minDelayBetweenRequests *= 2;
          throw new Error('Rate limit exceeded. Increasing delay between requests.');
        }
        throw new Error(`HTTP Error: ${error.response?.status} - ${error.message}`);
      }
      throw error;
    }
  }

  private async updateLastScrapedTime(url: string): Promise<void> {
    try {
      await supabase
        .from(TABLES.SOURCES)
        .upsert({
          url,
          last_scraped_at: new Date().toISOString(),
        }, {
          onConflict: 'url'
        });
    } catch (error) {
      console.error('Error updating last scraped time:', error);
    }
  }

  public async isUrlAllowed(url: string): Promise<boolean> {
    await this.ensureRobotsRules();
    return robotsRules.isAllowed(url);
  }

  public getCrawlDelay(): number {
    return robotsRules?.getCrawlDelay() || 1;
  }
} 