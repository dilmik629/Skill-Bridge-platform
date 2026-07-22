<?php
namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder {
    public function run(): void {
        $categories = [
            ['name'=>'Web Development', 'slug'=>'web-dev',  'icon'=>'🌐'],
            ['name'=>'UI/UX Design',    'slug'=>'ui-ux',    'icon'=>'🎨'],
            ['name'=>'Backend / API',   'slug'=>'backend',  'icon'=>'⚙️'],
            ['name'=>'AI / ML',         'slug'=>'ai-ml',    'icon'=>'🤖'],
            ['name'=>'Mobile App',      'slug'=>'mobile',   'icon'=>'📱'],
        ];
        foreach ($categories as $cat) {
            Category::firstOrCreate(['slug'=>$cat['slug']], $cat);
        }
    }
}