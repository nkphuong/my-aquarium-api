import { Injectable } from '@nestjs/common';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {
  constructor(private readonly supabaseService: SupabaseService) {}

  getHello(): string {
    return 'Hello World!';
  }

  // Example method showing how to use Supabase
  async getExampleData() {
    const supabase = this.supabaseService.getClient();
    // Example query - replace 'your_table' with actual table name
    // const { data, error } = await supabase.from('your_table').select('*');
    // return { data, error };
    return supabase;
  }
}
