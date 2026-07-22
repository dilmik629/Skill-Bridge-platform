<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Project;
use App\Models\Category;
use Illuminate\Http\Request;

class ProjectController extends Controller {

    public function index(Request $request) {
        $projects = Project::with(['category','creator'])
            ->when($request->status, fn($q,$v) => $q->where('status',$v))
            ->when($request->level,  fn($q,$v) => $q->where('level',$v))
            ->when($request->search, fn($q,$v) => $q->where('title','like',"%$v%"))
            ->withCount('applications','submissions')
            ->latest()->paginate(15);

        return response()->json($projects);
    }

    // POST /api/admin/projects
    public function store(Request $request) {
        $data = $request->validate([
            'title'        => 'required|string|max:200',
            'description'  => 'required|string',
            'category_id'  => 'required|exists:categories,id',
            'level'        => 'required|in:beginner,intermediate,advanced',
            'tech_stack'   => 'nullable|array',
            'deadline'     => 'required|date|after:today',
            'max_students' => 'required|integer|min:1|max:100',
            'status'       => 'in:open,closed,in_progress',
        ]);

        $project = Project::create([
            ...$data,
            'created_by' => $request->user()->id,
        ]);

        return response()->json([
            'message' => 'Project created successfully.',
            'project' => $project->load('category'),
        ], 201);
    }

    // GET /api/admin/projects/{id}
    public function show(Project $project) {
        return response()->json(
            $project->load(['category','quiz.questions','applications.student','submissions.student'])
        );
    }

    // PUT /api/admin/projects/{id}
    public function update(Request $request, Project $project) {
        $data = $request->validate([
            'title'        => 'sometimes|string|max:200',
            'description'  => 'sometimes|string',
            'category_id'  => 'sometimes|exists:categories,id',
            'level'        => 'sometimes|in:beginner,intermediate,advanced',
            'tech_stack'   => 'nullable|array',
            'deadline'     => 'sometimes|date',
            'max_students' => 'sometimes|integer|min:1|max:100',
            'status'       => 'sometimes|in:open,closed,in_progress',
        ]);

        $project->update($data);

        return response()->json([
            'message' => 'Project updated successfully.',
            'project' => $project->fresh('category'),
        ]);
    }

    // DELETE /api/admin/projects/{id}
    public function destroy(Project $project) {
        $project->delete();
        return response()->json(['message' => 'Project deleted.']);
    }
}