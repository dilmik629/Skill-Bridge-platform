<?php
namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class NotificationController extends Controller {

    public function index(Request $request) {
        $notifications = Notification::where('user_id', $request->user()->id)
            ->latest()->take(50)->get();
        return response()->json($notifications);
    }

    public function markRead(Request $request, Notification $notification) {
        if ($notification->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized.'], 403);
        }
        $notification->update(['is_read' => true]);
        return response()->json(['message' => 'Marked as read.']);
    }

    public function markAllRead(Request $request) {
        Notification::where('user_id', $request->user()->id)
            ->update(['is_read' => true]);
        return response()->json(['message' => 'All notifications marked as read.']);
    }
}