# Reading Progress & Engagement System - Backend API Integration Guide

## Overview
Complete backend API specification for user reading progress tracking, novel completion tracking, and chapter engagement (likes, comments).

---

## 1. Reading Progress Endpoints

### 1.1 Get All Reading Progress
**Endpoint:** `GET /api/reading/progress`
**Authentication:** Required (Bearer Token)
**Description:** Fetch user's reading progress for all novels

**Response:**
```json
[
  {
    "novelId": 1,
    "novelTitle": "ராட்சசனே என் வதைப்பதேனடா!",
    "coverImage": "path/to/image.jpg",
    "author": "அமுது",
    "lastChapter": 5,
    "totalChapters": 27,
    "isCompleted": false,
    "startedAt": "2025-01-10T10:30:00Z",
    "updatedAt": "2025-01-15T14:20:00Z",
    "completedAt": null
  },
  {
    "novelId": 2,
    "novelTitle": "தாலாட்டும் தாழம்பூவே!",
    "coverImage": "path/to/image.jpg",
    "author": "அமுது",
    "lastChapter": 27,
    "totalChapters": 27,
    "isCompleted": true,
    "startedAt": "2025-01-01T10:00:00Z",
    "updatedAt": "2025-01-20T18:00:00Z",
    "completedAt": "2025-01-20T18:00:00Z"
  }
]
```

---

### 1.2 Update Reading Progress
**Endpoint:** `POST /api/reading/progress`
**Authentication:** Required
**Description:** Update user's reading progress for a novel

**Request Body:**
```json
{
  "novelId": 1,
  "novelTitle": "ராட்சசனே என் வதைப்பதேனடா!",
  "coverImage": "path/to/image.jpg",
  "author": "அமுது",
  "lastChapter": 6,
  "isCompleted": false,
  "updatedAt": "2025-01-16T10:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reading progress updated",
  "data": {
    "novelId": 1,
    "lastChapter": 6,
    "isCompleted": false,
    "updatedAt": "2025-01-16T10:00:00Z"
  }
}
```

---

### 1.3 Start Reading Novel
**Endpoint:** `POST /api/reading/start`
**Authentication:** Required
**Description:** Mark novel as started (add to ON-GOING)

**Request Body:**
```json
{
  "novelId": 1,
  "novelTitle": "ராட்சசனே என் வதைப்பதேனடா!",
  "coverImage": "path/to/image.jpg",
  "author": "அமுது"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Novel started",
  "data": {
    "novelId": 1,
    "lastChapter": 1,
    "isCompleted": false,
    "startedAt": "2025-01-16T10:00:00Z"
  }
}
```

---

### 1.4 Complete Novel
**Endpoint:** `POST /api/reading/complete`
**Authentication:** Required
**Description:** Mark novel as completed (move to COMPLETED section)

**Request Body:**
```json
{
  "novelId": 1,
  "novelTitle": "ராட்சசனே என் வதைப்பதேனடா!",
  "coverImage": "path/to/image.jpg",
  "author": "அமுது"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Novel completed",
  "data": {
    "novelId": 1,
    "lastChapter": 27,
    "isCompleted": true,
    "completedAt": "2025-01-20T18:00:00Z"
  }
}
```

---

### 1.5 Delete Reading Progress
**Endpoint:** `DELETE /api/reading/progress/:novelId`
**Authentication:** Required
**Description:** Remove novel from reading progress (restart novel)

**Response:**
```json
{
  "success": true,
  "message": "Reading progress deleted",
  "data": {
    "novelId": 1
  }
}
```

---

## 2. Chapter Engagement Endpoints

### 2.1 Like Chapter
**Endpoint:** `POST /api/engagement/chapter/like`
**Authentication:** Required
**Description:** Like a chapter

**Request Body:**
```json
{
  "novelId": 1,
  "chapterId": 5,
  "likedAt": "2025-01-16T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter liked",
  "data": {
    "novelId": 1,
    "chapterId": 5,
    "likesCount": 42
  }
}
```

---

### 2.2 Unlike Chapter
**Endpoint:** `DELETE /api/engagement/chapter/like`
**Authentication:** Required
**Description:** Remove like from chapter

**Request Body:**
```json
{
  "novelId": 1,
  "chapterId": 5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Chapter unliked",
  "data": {
    "novelId": 1,
    "chapterId": 5,
    "likesCount": 41
  }
}
```

---

### 2.3 Check If Chapter Liked
**Endpoint:** `GET /api/engagement/chapter/:novelId/:chapterId/liked`
**Authentication:** Required
**Description:** Check if user liked a chapter

**Response:**
```json
{
  "isLiked": true,
  "novelId": 1,
  "chapterId": 5
}
```

---

### 2.4 Get Chapter Likes Count
**Endpoint:** `GET /api/engagement/chapter/:novelId/:chapterId/likes-count`
**Description:** Get total likes for a chapter

**Response:**
```json
{
  "novelId": 1,
  "chapterId": 5,
  "likesCount": 42
}
```

---

### 2.5 Post Comment on Chapter
**Endpoint:** `POST /api/engagement/chapter/comment`
**Authentication:** Required
**Description:** Post a comment on a chapter

**Request Body:**
```json
{
  "novelId": 1,
  "chapterId": 5,
  "comment": "Amazing chapter! The twist was unexpected!",
  "postedAt": "2025-01-16T10:30:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Comment posted",
  "data": {
    "id": "comment_123",
    "novelId": 1,
    "chapterId": 5,
    "userName": "user_name",
    "comment": "Amazing chapter! The twist was unexpected!",
    "postedAt": "2025-01-16T10:30:00Z"
  }
}
```

---

### 2.6 Get Chapter Comments
**Endpoint:** `GET /api/engagement/chapter/:novelId/:chapterId/comments`
**Query Params:**
- `limit` (optional): Number of comments to fetch (default: 20)
- `offset` (optional): Pagination offset (default: 0)

**Response:**
```json
{
  "comments": [
    {
      "id": "comment_123",
      "novelId": 1,
      "chapterId": 5,
      "userName": "user_name",
      "comment": "Amazing chapter!",
      "postedAt": "2025-01-16T10:30:00Z"
    },
    {
      "id": "comment_124",
      "novelId": 1,
      "chapterId": 5,
      "userName": "another_user",
      "comment": "I loved this!",
      "postedAt": "2025-01-16T10:35:00Z"
    }
  ],
  "total": 2,
  "limit": 20,
  "offset": 0
}
```

---

### 2.7 Delete Comment
**Endpoint:** `DELETE /api/engagement/comment/:commentId`
**Authentication:** Required
**Description:** Delete own comment

**Response:**
```json
{
  "success": true,
  "message": "Comment deleted",
  "data": {
    "commentId": "comment_123"
  }
}
```

---

### 2.8 Reply to Comment
**Endpoint:** `POST /api/engagement/chapter/reply`
**Authentication:** Required
**Description:** Reply to a comment

**Request Body:**
```json
{
  "novelId": 1,
  "chapterId": 5,
  "parentCommentId": "comment_123",
  "reply": "I totally agree with you!",
  "repliedAt": "2025-01-16T10:40:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Reply posted",
  "data": {
    "id": "comment_125",
    "parentCommentId": "comment_123",
    "reply": "I totally agree with you!",
    "repliedAt": "2025-01-16T10:40:00Z"
  }
}
```

---

### 2.9 Get Novel Engagement Stats
**Endpoint:** `GET /api/engagement/novel/:novelId/stats`
**Description:** Get user's engagement stats for a novel

**Response:**
```json
{
  "novelId": 1,
  "likes": 3,
  "comments": 5,
  "bookmarks": 1,
  "chaptersLiked": [1, 3, 5],
  "chaptersCommented": [2, 4, 5]
}
```

---

### 2.10 Get Chapter-wise Engagement Stats
**Endpoint:** `GET /api/engagement/novel/:novelId/chapters/stats`
**Description:** Get engagement stats for all chapters of a novel

**Response:**
```json
{
  "novelId": 1,
  "chapters": [
    {
      "chapterId": 1,
      "likesCount": 15,
      "commentsCount": 3
    },
    {
      "chapterId": 2,
      "likesCount": 20,
      "commentsCount": 5
    },
    {
      "chapterId": 3,
      "likesCount": 18,
      "commentsCount": 4
    }
  ]
}
```

---

## 3. Database Schema (Recommended)

### 3.1 reading_progress Table
```sql
CREATE TABLE reading_progress (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  novelId INT NOT NULL,
  novelTitle VARCHAR(255),
  coverImage VARCHAR(500),
  author VARCHAR(255),
  lastChapter INT DEFAULT 1,
  totalChapters INT DEFAULT 27,
  isCompleted BOOLEAN DEFAULT FALSE,
  startedAt TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  completedAt TIMESTAMP NULL,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_user_novel (userId, novelId)
);
```

### 3.2 chapter_likes Table
```sql
CREATE TABLE chapter_likes (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  novelId INT NOT NULL,
  chapterId INT NOT NULL,
  likedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  UNIQUE KEY unique_user_chapter_like (userId, novelId, chapterId)
);
```

### 3.3 chapter_comments Table
```sql
CREATE TABLE chapter_comments (
  id VARCHAR(50) PRIMARY KEY,
  userId INT NOT NULL,
  novelId INT NOT NULL,
  chapterId INT NOT NULL,
  comment TEXT NOT NULL,
  postedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### 3.4 comment_replies Table
```sql
CREATE TABLE comment_replies (
  id VARCHAR(50) PRIMARY KEY,
  parentCommentId VARCHAR(50) NOT NULL,
  userId INT NOT NULL,
  reply TEXT NOT NULL,
  repliedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (parentCommentId) REFERENCES chapter_comments(id) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 4. Frontend Integration Examples

### 4.1 Track Chapter Reading
```javascript
// When user starts reading a chapter
import readingProgressService from '@/services/API/readingProgressService';

const handleChapterRead = async (novelId, chapterId) => {
  await readingProgressService.updateChapter(novelId, chapterId);
  console.log('Chapter progress updated');
};
```

### 4.2 Show Reading Dashboard
```javascript
// Import ReadingDashboard component
import ReadingDashboard from '@/components/ReadingDashboard/ReadingDashboard';

// Use in a page
<ReadingDashboard />
```

### 4.3 Add Engagement to Chapter
```javascript
// In ChapterPage component
import ChapterEngagement from '@/components/ChapterEngagement/ChapterEngagement';

<ChapterEngagement 
  novelId={novelId} 
  chapterId={chapterId} 
  chapterTitle={chapterTitle}
/>
```

---

## 5. Implementation Checklist

### Backend Tasks
- [ ] Create reading_progress table and endpoints
- [ ] Create chapter_likes table and endpoints
- [ ] Create chapter_comments table and endpoints
- [ ] Implement authentication middleware
- [ ] Add pagination for comments
- [ ] Add like/comment count caching
- [ ] Create indexes for better query performance
- [ ] Add input validation for comments
- [ ] Implement rate limiting for engagement

### Frontend Tasks
- [ ] ✅ Create ReadingDashboard component
- [ ] ✅ Create ChapterEngagement component
- [ ] ✅ Create engagementService.js
- [ ] ✅ Create readingProgressService.js (already exists)
- [ ] Add "Start Reading" button on novel pages
- [ ] Update ChapterPage to track reading
- [ ] Add "Complete Novel" button after final chapter
- [ ] Create user profile page to show stats
- [ ] Add notifications for engagement

### Testing Tasks
- [ ] Test reading progress tracking
- [ ] Test novel completion flow
- [ ] Test like functionality
- [ ] Test comment posting/deletion
- [ ] Test reply functionality
- [ ] Test stats generation
- [ ] Test pagination
- [ ] Test error handling

---

## 6. Security Considerations

1. **Authentication:** All endpoints except stats must verify JWT token
2. **Authorization:** Users can only access/modify their own data
3. **Input Validation:** Sanitize comments for XSS attacks
4. **Rate Limiting:** Limit comments/likes per user per hour
5. **Delete Comments:** Only author can delete own comments
6. **Report Abusive Content:** Add mechanism to report inappropriate comments

---

## 7. Performance Optimization

1. **Caching:**
   - Cache likes count (update every 5 minutes)
   - Cache user reading progress (update on each read)
   - Cache engagement stats (update on each action)

2. **Indexing:**
   - Index on (userId, novelId) for reading_progress
   - Index on (novelId, chapterId) for engagement tables
   - Index on (userId) for quick access

3. **Pagination:**
   - Always paginate comments (default 20 per page)
   - Load more on scroll
   - Cache next page during scroll

---

## 8. Future Enhancements

1. **Notifications:**
   - Notify when friend comments on chapter
   - Notify when comment gets replies
   - Notify reading milestones

2. **Social Features:**
   - Follow users
   - Share reading progress
   - Create reading groups
   - Collaborative discussions

3. **Analytics:**
   - Most liked chapters
   - Most commented chapters
   - Reading trends
   - User engagement metrics

4. **Recommendations:**
   - Suggest novels based on reading history
   - Suggest chapters to readers
   - Popular chapters this week

---

**Status:** Ready for Backend Implementation
**Last Updated:** January 16, 2025
