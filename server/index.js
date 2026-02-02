import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3001;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'JOsh'; // Change this in production
const DATA_FILE = join(__dirname, 'data', 'analytics.json');
const PROJECTS_FILE = join(__dirname, 'data', 'projects.json');
const SITE_FILE = join(__dirname, 'data', 'site.json');
const UPLOADS_DIR = join(__dirname, 'data', 'uploads');
const SESSIONS = new Map(); // In-memory session storage

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!existsSync(UPLOADS_DIR)) {
      mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpg, png, gif, webp)'));
    }
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:8081', 'http://localhost:8082', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());
// Serve uploaded images
app.use('/api/uploads', express.static(UPLOADS_DIR));

// Initialize analytics data file
function initDataFile() {
  const dataDir = join(__dirname, 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  if (!existsSync(DATA_FILE)) {
    const initialData = {
      events: [],
      sessions: [],
      aggregated: {
        clicksByElement: {},
        clicksBySection: {},
        scrollDepth: {},
        timeOnSection: {},
        popularElements: []
      }
    };
    writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Initialize projects data file
function initProjectsFile() {
  const dataDir = join(__dirname, 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }
  
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
  
  if (!existsSync(PROJECTS_FILE)) {
    const initialData = [];
    writeFileSync(PROJECTS_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Initialize site settings file
function initSiteFile() {
  const dataDir = join(__dirname, 'data');
  if (!existsSync(dataDir)) {
    mkdirSync(dataDir, { recursive: true });
  }

  if (!existsSync(SITE_FILE)) {
    const initialData = {
      profileImage: '',
      siteImages: []
    };
    writeFileSync(SITE_FILE, JSON.stringify(initialData, null, 2));
  }
}

// Read projects data
function readProjects() {
  try {
    const data = readFileSync(PROJECTS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading projects:', error);
    return [];
  }
}

// Read site settings
function readSiteSettings() {
  try {
    const data = readFileSync(SITE_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading site settings:', error);
    return { profileImage: '', siteImages: [] };
  }
}

// Write site settings
function writeSiteSettings(settings) {
  try {
    writeFileSync(SITE_FILE, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing site settings:', error);
  }
}

// Write projects data
function writeProjects(projects) {
  try {
    writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
  } catch (error) {
    console.error('Error writing projects:', error);
  }
}

// Read analytics data
function readData() {
  try {
    const data = readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data:', error);
    return {
      events: [],
      sessions: [],
      aggregated: {
        clicksByElement: {},
        clicksBySection: {},
        scrollDepth: {},
        timeOnSection: {},
        popularElements: []
      }
    };
  }
}

// Write analytics data
function writeData(data) {
  try {
    writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing data:', error);
  }
}

// Aggregate analytics data
function aggregateData(data) {
  const aggregated = {
    clicksByElement: {},
    clicksBySection: {},
    scrollDepth: {},
    timeOnSection: {},
    popularElements: []
  };

  // Process events
  data.events.forEach(event => {
    if (event.type === 'click') {
      // Count clicks by element
      if (event.element) {
        aggregated.clicksByElement[event.element] = (aggregated.clicksByElement[event.element] || 0) + 1;
      }
      // Count clicks by section
      if (event.section) {
        aggregated.clicksBySection[event.section] = (aggregated.clicksBySection[event.section] || 0) + 1;
      }
    } else if (event.type === 'scroll') {
      if (event.section && event.metadata?.depth) {
        const currentDepth = aggregated.scrollDepth[event.section] || 0;
        aggregated.scrollDepth[event.section] = Math.max(currentDepth, event.metadata.depth);
      }
    } else if (event.type === 'view') {
      if (event.section && event.metadata?.timeSpent) {
        aggregated.timeOnSection[event.section] = (aggregated.timeOnSection[event.section] || 0) + event.metadata.timeSpent;
      }
    }
  });

  // Create popular elements array
  aggregated.popularElements = Object.entries(aggregated.clicksByElement)
    .map(([element, count]) => ({ element, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  return aggregated;
}

// Middleware to check authentication
function requireAuth(req, res, next) {
  const sessionId = req.cookies.sessionId;
  if (!sessionId || !SESSIONS.has(sessionId)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Track analytics event
app.post('/api/analytics/track', (req, res) => {
  try {
    const event = req.body;
    
    // Validate event
    if (!event.type || !event.sessionId) {
      return res.status(400).json({ error: 'Invalid event data' });
    }

    // Add timestamp if not present
    if (!event.timestamp) {
      event.timestamp = Date.now();
    }

    // Add unique ID if not present
    if (!event.id) {
      event.id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    // Read current data
    const data = readData();

    // Add event
    data.events.push(event);

    // Update or create session
    let session = data.sessions.find(s => s.id === event.sessionId);
    if (!session) {
      session = {
        id: event.sessionId,
        startTime: event.timestamp,
        endTime: event.timestamp,
        sections: [],
        interactions: 0
      };
      data.sessions.push(session);
    }

    // Update session
    session.endTime = Math.max(session.endTime, event.timestamp);
    session.interactions += 1;
    if (event.section && !session.sections.includes(event.section)) {
      session.sections.push(event.section);
    }

    // Re-aggregate data
    data.aggregated = aggregateData(data);

    // Write back to file
    writeData(data);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking event:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get analytics data (protected)
app.get('/api/analytics/data', requireAuth, (req, res) => {
  try {
    const data = readData();
    
    // Apply filters if provided
    const { startDate, endDate, eventType, section } = req.query;
    let filteredEvents = [...data.events];

    if (startDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp >= parseInt(startDate));
    }
    if (endDate) {
      filteredEvents = filteredEvents.filter(e => e.timestamp <= parseInt(endDate));
    }
    if (eventType) {
      filteredEvents = filteredEvents.filter(e => e.type === eventType);
    }
    if (section) {
      filteredEvents = filteredEvents.filter(e => e.section === section);
    }

    res.json({
      events: filteredEvents,
      sessions: data.sessions,
      aggregated: data.aggregated,
      totalEvents: data.events.length,
      totalSessions: data.sessions.length
    });
  } catch (error) {
    console.error('Error getting analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;
  
  if (password === ADMIN_PASSWORD) {
    const sessionId = `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    SESSIONS.set(sessionId, { authenticated: true, createdAt: Date.now() });
    
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax'
    });
    
    res.json({ success: true, sessionId });
  } else {
    res.status(401).json({ error: 'Invalid password' });
  }
});

// Verify session
app.get('/api/auth/verify', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId && SESSIONS.has(sessionId)) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const sessionId = req.cookies.sessionId;
  if (sessionId) {
    SESSIONS.delete(sessionId);
  }
  res.clearCookie('sessionId');
  res.json({ success: true });
});

// Project Management Routes

// Get all projects (public)
app.get('/api/projects', (req, res) => {
  try {
    const projects = readProjects();
    // Sort by order
    const sorted = projects.sort((a, b) => (a.order || 0) - (b.order || 0));
    res.json(sorted);
  } catch (error) {
    console.error('Error getting projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get single project
app.get('/api/projects/:id', (req, res) => {
  try {
    const projects = readProjects();
    const project = projects.find(p => p.id === req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    console.error('Error getting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create project (protected)
app.post('/api/projects', requireAuth, (req, res) => {
  try {
    const { title, description, image, websiteLink, techStack } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const projects = readProjects();
    const maxOrder = projects.length > 0 ? Math.max(...projects.map(p => p.order || 0)) : -1;
    
    const newProject = {
      id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title,
      description,
      image: image || '',
      websiteLink: websiteLink || '',
      techStack: Array.isArray(techStack) ? techStack : [],
      order: maxOrder + 1,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };

    projects.push(newProject);
    writeProjects(projects);
    
    res.json(newProject);
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update project (protected)
app.put('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const projects = readProjects();
    const index = projects.findIndex(p => p.id === req.params.id);
    
    if (index === -1) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const { title, description, image, websiteLink, techStack } = req.body;
    
    projects[index] = {
      ...projects[index],
      title: title !== undefined ? title : projects[index].title,
      description: description !== undefined ? description : projects[index].description,
      image: image !== undefined ? image : projects[index].image,
      websiteLink: websiteLink !== undefined ? websiteLink : projects[index].websiteLink,
      techStack: techStack !== undefined ? (Array.isArray(techStack) ? techStack : []) : projects[index].techStack,
      updatedAt: Date.now()
    };

    writeProjects(projects);
    res.json(projects[index]);
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete project (protected)
app.delete('/api/projects/:id', requireAuth, (req, res) => {
  try {
    const projects = readProjects();
    const filtered = projects.filter(p => p.id !== req.params.id);
    
    if (filtered.length === projects.length) {
      return res.status(404).json({ error: 'Project not found' });
    }

    writeProjects(filtered);
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reorder projects (protected)
app.put('/api/projects/reorder', requireAuth, (req, res) => {
  try {
    const { projectIds } = req.body;
    
    if (!Array.isArray(projectIds)) {
      return res.status(400).json({ error: 'projectIds must be an array' });
    }

    const projects = readProjects();
    
    projectIds.forEach((id, index) => {
      const project = projects.find(p => p.id === id);
      if (project) {
        project.order = index;
        project.updatedAt = Date.now();
      }
    });

    writeProjects(projects);
    res.json({ success: true });
  } catch (error) {
    console.error('Error reordering projects:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload image (protected)
app.post('/api/projects/upload', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Site settings (public)
app.get('/api/site-settings', (req, res) => {
  try {
    const settings = readSiteSettings();
    res.json(settings);
  } catch (error) {
    console.error('Error getting site settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update site settings (protected)
app.put('/api/site-settings', requireAuth, (req, res) => {
  try {
    const { profileImage, siteImages } = req.body;
    const current = readSiteSettings();
    const updated = {
      ...current,
      profileImage: profileImage !== undefined ? profileImage : current.profileImage,
      siteImages: Array.isArray(siteImages) ? siteImages : current.siteImages
    };
    writeSiteSettings(updated);
    res.json(updated);
  } catch (error) {
    console.error('Error updating site settings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Upload site image (protected)
app.post('/api/site-settings/upload', requireAuth, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const fileUrl = `/api/uploads/${req.file.filename}`;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    console.error('Error uploading site image:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start server
initDataFile();
initProjectsFile();
initSiteFile();

app.listen(PORT, () => {
  console.log(`Analytics server running on http://localhost:${PORT}`);
  console.log(`Admin password: ${ADMIN_PASSWORD}`);
});

