<?php
namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Project;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\LeaderboardScore;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // ─── Demo Students ───────────────────────────
        $students = [
            ['name' => 'Dilmi Silva',   'email' => 'dilmi@demo.com',   'points' => 840],
            ['name' => 'Tharindu P.',   'email' => 'tharindu@demo.com','points' => 920],
            ['name' => 'Ama Perera',    'email' => 'ama@demo.com',     'points' => 650],
            ['name' => 'Kavya Sharma',  'email' => 'kavya@demo.com',   'points' => 1100],
            ['name' => 'Ruwan K.',      'email' => 'ruwan@demo.com',   'points' => 430],
        ];

        $createdStudents = [];
        foreach ($students as $s) {
            $student = User::firstOrCreate(
                ['email' => $s['email']],
                [
                    'name'         => $s['name'],
                    'password'     => Hash::make('Student@1234'),
                    'role'         => 'student',
                    'skill_points' => $s['points'],
                    'bio'          => 'Full-stack developer learning through real projects on SkillBridge.',
                    'github_username' => strtolower(explode(' ', $s['name'])[0]),
                    'email_verified_at' => now(),
                ]
            );
            LeaderboardScore::firstOrCreate(
                ['student_id' => $student->id],
                ['total_points' => $s['points'], 'projects_completed' => rand(2,8)]
            );
            $createdStudents[] = $student;
        }

        // ─── Demo Projects + Quizzes ─────────────────
        $admin      = User::where('role','admin')->first();
        $categories = Category::all()->keyBy('slug');

        $projects = [
            [
                'title'       => 'E-Commerce Website with React',
                'description' => 'Build a fully functional e-commerce platform with product listings, shopping cart, checkout flow, and order management. Use React for the frontend and connect to a REST API.',
                'category'    => 'web-dev',
                'level'       => 'intermediate',
                'tech_stack'  => ['React','Laravel','MySQL','Tailwind CSS'],
                'deadline'    => now()->addDays(30)->format('Y-m-d'),
                'max_students'=> 5,
                'questions'   => [
                    ['q'=>'What does JSX stand for in React?',          'a'=>'JavaScript XML',      'b'=>'Java Syntax Extension','c'=>'JSON XML','d'=>'JavaScript Extension','correct'=>'a'],
                    ['q'=>'Which hook manages state in React?',          'a'=>'useEffect',           'b'=>'useState',             'c'=>'useContext','d'=>'useRef','correct'=>'b'],
                    ['q'=>'What is the virtual DOM in React?',           'a'=>'A browser feature',   'b'=>'A database',           'c'=>'A lightweight copy of the real DOM','d'=>'A CSS framework','correct'=>'c'],
                    ['q'=>'Which method sends data in a POST request?',  'a'=>'fetch GET',           'b'=>'axios.post()',         'c'=>'axios.get()','d'=>'fetch.send()','correct'=>'b'],
                    ['q'=>'What does REST stand for?',                   'a'=>'Remote Execution State Transfer','b'=>'Representational State Transfer','c'=>'React State Transfer','d'=>'Remote Service Transfer','correct'=>'b'],
                ],
            ],
            [
                'title'       => 'Portfolio Website Design',
                'description' => 'Design and build a beautiful personal portfolio website showcasing your skills, projects, and contact information. Focus on responsive design, animations, and user experience.',
                'category'    => 'ui-ux',
                'level'       => 'beginner',
                'tech_stack'  => ['HTML','CSS','JavaScript','Figma'],
                'deadline'    => now()->addDays(21)->format('Y-m-d'),
                'max_students'=> 8,
                'questions'   => [
                    ['q'=>'What does CSS stand for?',                    'a'=>'Computer Style Sheet','b'=>'Cascading Style Sheets','c'=>'Creative Style System','d'=>'Code Style Sheet','correct'=>'b'],
                    ['q'=>'Which HTML tag creates a hyperlink?',         'a'=>'<link>',              'b'=>'<href>',               'c'=>'<a>','d'=>'<url>','correct'=>'c'],
                    ['q'=>'What is responsive design?',                  'a'=>'Fast loading pages',  'b'=>'Design that adapts to all screen sizes','c'=>'Interactive animations','d'=>'Server-side rendering','correct'=>'b'],
                    ['q'=>'Which CSS property controls element spacing?','a'=>'spacing',             'b'=>'margin',               'c'=>'border','d'=>'padding','correct'=>'d'],
                    ['q'=>'What is Flexbox used for?',                   'a'=>'Database management', 'b'=>'Server routing',       'c'=>'Layout design in CSS','d'=>'JavaScript functions','correct'=>'c'],
                ],
            ],
            [
                'title'       => 'REST API with Laravel',
                'description' => 'Build a complete RESTful API using Laravel with authentication, CRUD operations, middleware, and proper API documentation. Include Sanctum token auth and resource controllers.',
                'category'    => 'backend',
                'level'       => 'intermediate',
                'tech_stack'  => ['PHP','Laravel','MySQL','Postman'],
                'deadline'    => now()->addDays(25)->format('Y-m-d'),
                'max_students'=> 4,
                'questions'   => [
                    ['q'=>'Which HTTP method is used to create a resource?',  'a'=>'GET',  'b'=>'DELETE','c'=>'POST','d'=>'PATCH','correct'=>'c'],
                    ['q'=>'What does ORM stand for?',                         'a'=>'Object Relational Mapping','b'=>'Online Resource Manager','c'=>'Open Route Method','d'=>'Object Route Model','correct'=>'a'],
                    ['q'=>'What is middleware in Laravel?',                    'a'=>'A database','b'=>'Code that runs between request and response','c'=>'A frontend framework','d'=>'A testing tool','correct'=>'b'],
                    ['q'=>'Which HTTP status code means "Not Found"?',        'a'=>'200','b'=>'201','c'=>'401','d'=>'404','correct'=>'d'],
                    ['q'=>'What does CRUD stand for?',                        'a'=>'Create Read Update Delete','b'=>'Code Run Update Deploy','c'=>'Create Route Update Delete','d'=>'Code Read Update Database','correct'=>'a'],
                ],
            ],
            [
                'title'       => 'AI Chatbot Integration',
                'description' => 'Build an AI-powered chatbot using Python and integrate it into a web interface. Use NLP libraries, train a basic model, and deploy it as a REST API endpoint.',
                'category'    => 'ai-ml',
                'level'       => 'advanced',
                'tech_stack'  => ['Python','TensorFlow','FastAPI','React'],
                'deadline'    => now()->addDays(45)->format('Y-m-d'),
                'max_students'=> 3,
                'questions'   => [
                    ['q'=>'What does NLP stand for?',                         'a'=>'Network Layer Protocol','b'=>'Natural Language Processing','c'=>'Neural Learning Process','d'=>'None of above','correct'=>'b'],
                    ['q'=>'What is a neural network?',                        'a'=>'A database structure','b'=>'A network of computers','c'=>'A computational model inspired by the brain','d'=>'A CSS framework','correct'=>'c'],
                    ['q'=>'Which Python library is used for machine learning?','a'=>'NumPy','b'=>'Pandas','c'=>'TensorFlow','d'=>'Flask','correct'=>'c'],
                    ['q'=>'What is supervised learning?',                     'a'=>'Learning without data','b'=>'Learning from labeled training data','c'=>'Learning from unlabeled data','d'=>'Manual coding','correct'=>'b'],
                    ['q'=>'What is overfitting in ML?',                       'a'=>'Model too simple','b'=>'Model performs well on training but poorly on new data','c'=>'Using too little data','d'=>'Slow training speed','correct'=>'b'],
                ],
            ],
            [
                'title'       => 'Mobile App UI Design',
                'description' => 'Design a complete mobile app UI in Figma including wireframes, prototypes, design system, and handoff documentation. Create a food delivery or fitness tracking app.',
                'category'    => 'ui-ux',
                'level'       => 'beginner',
                'tech_stack'  => ['Figma','Adobe XD','Sketch','Prototyping'],
                'deadline'    => now()->addDays(18)->format('Y-m-d'),
                'max_students'=> 6,
                'questions'   => [
                    ['q'=>'What is a wireframe?',                             'a'=>'A finished design','b'=>'A basic structural layout of a page','c'=>'A color palette','d'=>'A font system','correct'=>'b'],
                    ['q'=>'What does UX stand for?',                         'a'=>'User Experience','b'=>'User Extension','c'=>'Universal Exchange','d'=>'Unified Experience','correct'=>'a'],
                    ['q'=>'What is a design system?',                        'a'=>'A software tool','b'=>'A collection of reusable components and guidelines','c'=>'A project management tool','d'=>'A coding framework','correct'=>'b'],
                    ['q'=>'What is the 8pt grid system?',                    'a'=>'A font size rule','b'=>'A spacing system using multiples of 8','c'=>'A color system','d'=>'A layout tool','correct'=>'b'],
                    ['q'=>'What does prototype mean in UX?',                 'a'=>'The final product','b'=>'The source code','c'=>'An interactive mockup of the design','d'=>'A user interview','correct'=>'c'],
                ],
            ],
        ];

        foreach ($projects as $pData) {
            $cat = $categories[$pData['category']] ?? $categories->first();
            if (!$cat) continue;

            $project = Project::firstOrCreate(
                ['title' => $pData['title']],
                [
                    'category_id'  => $cat->id,
                    'created_by'   => $admin->id,
                    'description'  => $pData['description'],
                    'tech_stack'   => $pData['tech_stack'],
                    'level'        => $pData['level'],
                    'status'       => 'open',
                    'deadline'     => $pData['deadline'],
                    'max_students' => $pData['max_students'],
                ]
            );

            // Quiz create
            if (!$project->quiz) {
                $quiz = Quiz::create([
                    'project_id'            => $project->id,
                    'pass_mark'             => 70,
                    'retake_cooldown_hours' => 24,
                ]);

                foreach ($pData['questions'] as $i => $q) {
                    Question::create([
                        'quiz_id'        => $quiz->id,
                        'question_text'  => $q['q'],
                        'option_a'       => $q['a'],
                        'option_b'       => $q['b'],
                        'option_c'       => $q['c'],
                        'option_d'       => $q['d'],
                        'correct_option' => $q['correct'],
                        'order'          => $i + 1,
                    ]);
                }
            }
        }

        $this->command->info('✅ Demo data seeded!');
        $this->command->info('   → 5 demo projects created');
        $this->command->info('   → 5 quizzes with 5 questions each');
        $this->command->info('   → 5 demo students created');
        $this->command->info('   → Student password: Student@1234');
    }
}