const express = require('express');
const app = express();
const port = 3001;

// Middleware to parse JSON
app.use(express.json());

// =======================
// Task 3: Request Counter Middleware
// =======================
let requestCount = 0;

const countRequests = (req, res, next) => {
  requestCount++;
  next();
};

app.use(countRequests);

// =======================
// Task 5: Request Time Middleware
// =======================
const addRequestTime = (req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
};

app.use(addRequestTime);

// =======================
// Task 1: University Course Registration API
// =======================
let courses = [
  { id: 1, name: "Data Structures", seats: 30 },
  { id: 2, name: "Operating Systems", seats: 25 }
];

// GET /courses - View all courses
app.get('/courses', (req, res) => {
  res.json(courses);
});

// GET /courses/:id - View specific course
app.get('/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  
  res.json(course);
});

// POST /courses - Add new course
app.post('/courses', (req, res) => {
  const { id, name, seats } = req.body;
  
  if (!id || !name || seats === undefined) {
    return res.status(400).json({ message: 'Invalid Request: Required fields missing' });
  }
  
  const newCourse = { id, name, seats };
  courses.push(newCourse);
  res.status(201).json(newCourse);
});

// PUT /courses/:id - Update course seats
app.put('/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const { seats } = req.body;
  
  if (seats === undefined) {
    return res.status(400).json({ message: 'Invalid Request: Seats field required' });
  }
  
  const course = courses.find(c => c.id === courseId);
  
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  
  course.seats = seats;
  res.json(course);
});

// DELETE /courses/:id - Delete course
app.delete('/courses/:id', (req, res) => {
  const courseId = parseInt(req.params.id);
  const courseIndex = courses.findIndex(c => c.id === courseId);
  
  if (courseIndex === -1) {
    return res.status(404).json({ message: 'Course not found' });
  }
  
  const deletedCourse = courses.splice(courseIndex, 1);
  res.json({ message: 'Course deleted', course: deletedCourse[0] });
});

// =======================
// Task 2: Space Mission Crew Management System
// =======================
let astronauts = [
  { name: "Ayesha Khan", specialization: "Pilot", skillLevel: "Advanced" },
  { name: "Omar Malik", specialization: "Robotics Engineer", skillLevel: "Intermediate" },
  { name: "Dr. Sara Chen", specialization: "Medicine", skillLevel: "Advanced" },
  { name: "James Wright", specialization: "Engineering", skillLevel: "Intermediate" }
];

let missions = [];

// GET /astronauts - Get all astronauts
app.get('/astronauts', (req, res) => {
  res.json(astronauts);
});

// POST /missions - Create new mission
app.post('/missions', (req, res) => {
  const { missionName, crew } = req.body;
  
  // Validate using validateMission middleware (Task 4)
  if (!missionName || !crew) {
    return res.status(400).json({ message: 'Invalid Request: Required fields missing' });
  }
  
  if (!Array.isArray(crew)) {
    return res.status(400).json({ message: 'Invalid Request: crew must be an array' });
  }
  
  // Validate that all astronauts exist
  for (const astronautName of crew) {
    const exists = astronauts.find(a => a.name === astronautName);
    if (!exists) {
      return res.status(400).json({ message: `Astronaut '${astronautName}' not found` });
    }
  }
  
  // Check if astronauts are already assigned to another mission
  for (const astronautName of crew) {
    const alreadyAssigned = missions.some(m => m.crew.includes(astronautName));
    if (alreadyAssigned) {
      return res.status(400).json({ message: `Astronaut '${astronautName}' is already assigned to another mission` });
    }
  }
  
  // Calculate mission capability score (based on skill levels)
  let missionCapabilityScore = 0;
  crew.forEach(astronautName => {
    const astronaut = astronauts.find(a => a.name === astronautName);
    if (astronaut.skillLevel === 'Advanced') {
      missionCapabilityScore += 50;
    } else if (astronaut.skillLevel === 'Intermediate') {
      missionCapabilityScore += 30;
    } else {
      missionCapabilityScore += 10;
    }
  });
  
  const newMission = {
    missionName,
    crew,
    missionCapabilityScore
  };
  
  missions.push(newMission);
  res.status(201).json(newMission);
});

// GET /missions/:missionName - Get specific mission
app.get('/missions/:missionName', (req, res) => {
  const { missionName } = req.params;
  const mission = missions.find(m => m.missionName === missionName);
  
  if (!mission) {
    return res.status(404).json({ message: 'Mission not found' });
  }
  
  res.json(mission);
});

// DELETE /missions/:missionName - Delete mission
app.delete('/missions/:missionName', (req, res) => {
  const { missionName } = req.params;
  const missionIndex = missions.findIndex(m => m.missionName === missionName);
  
  if (missionIndex === -1) {
    return res.status(404).json({ message: 'Mission not found' });
  }
  
  missions.splice(missionIndex, 1);
  res.json({ message: `Mission "${missionName}" has been successfully cancelled.` });
});

// =======================
// Task 3: Request Counter Middleware
// =======================
// GET /stats - Get request statistics
app.get('/stats', (req, res) => {
  res.json({ message: `Total API Requests: ${requestCount}` });
});

// =======================
// Task 4: Input Validation Middleware
// =======================
const validateMission = (req, res, next) => {
  const { missionName, crew } = req.body;
  
  if (!missionName || !crew) {
    return res.status(400).json({ message: 'Invalid Request: Required fields missing' });
  }
  
  next();
};

// Apply validation middleware to POST /missions (alternative endpoint if needed)
app.post('/missions-validated', validateMission, (req, res) => {
  const { missionName, crew } = req.body;
  
  // Check if astronauts exist
  for (const astronautName of crew) {
    const exists = astronauts.find(a => a.name === astronautName);
    if (!exists) {
      return res.status(400).json({ message: `Astronaut '${astronautName}' not found` });
    }
  }
  
  // Check if astronauts are already assigned
  for (const astronautName of crew) {
    const alreadyAssigned = missions.some(m => m.crew.includes(astronautName));
    if (alreadyAssigned) {
      return res.status(400).json({ message: `Astronaut '${astronautName}' is already assigned to another mission` });
    }
  }
  
  // Calculate score
  let missionCapabilityScore = 0;
  crew.forEach(astronautName => {
    const astronaut = astronauts.find(a => a.name === astronautName);
    if (astronaut.skillLevel === 'Advanced') {
      missionCapabilityScore += 50;
    } else if (astronaut.skillLevel === 'Intermediate') {
      missionCapabilityScore += 30;
    } else {
      missionCapabilityScore += 10;
    }
  });
  
  const newMission = { missionName, crew, missionCapabilityScore };
  missions.push(newMission);
  res.status(201).json(newMission);
});

// =======================
// Task 5: Request Time Middleware
// =======================
// GET /request-time - Get request time
app.get('/request-time', (req, res) => {
  res.json({ message: `This request was received at: ${req.requestTime}` });
});

// =======================
// Task 6: Wildlife Rescue Mission API
// =======================
let rescueMissions = [];

// Middleware: Animal Type Check
const animalTypeCheck = (req, res, next) => {
  const { animalType } = req.body;
  const validTypes = ['bird', 'mammal', 'reptile'];
  
  if (!animalType || !validTypes.includes(animalType)) {
    return res.status(400).json({ message: 'Invalid animal type. Must be bird, mammal, or reptile' });
  }
  
  req.animalType = animalType;
  next();
};

// Middleware: Severity Level Check
const severityLevelCheck = (req, res, next) => {
  const { severity } = req.body;
  const validSeverities = ['mild', 'moderate', 'severe'];
  
  if (!severity || !validSeverities.includes(severity)) {
    return res.status(400).json({ message: 'Invalid severity level. Must be mild, moderate, or severe' });
  }
  
  req.severity = severity;
  next();
};

// Middleware: Resource Availability Check
const resourceAvailabilityCheck = (req, res, next) => {
  const { resources } = req.body;
  
  // Assuming resources object with team members, vehicles, equipment
  if (!resources) {
    req.resources = { teamMembers: 5, vehicles: 2, equipment: true };
  } else {
    req.resources = resources;
  }
  
  next();
};

// Middleware: Mission Outcome Determination
const missionOutcomeDetermination = (req, res, next) => {
  const animalType = req.animalType;
  const severity = req.severity;
  const resources = req.resources;
  
  let outcome = 'success';
  let details = '';
  
  // Determine outcome based on severity
  if (severity === 'severe') {
    if (resources.teamMembers < 8 || !resources.equipment) {
      outcome = 'unsuccessful';
      details = 'Insufficient resources for severe rescue operation';
    } else {
      outcome = 'delayed';
      details = 'Reinforcements being called for severe situation';
    }
  } else if (severity === 'moderate') {
    if (resources.teamMembers < 5) {
      outcome = 'delayed';
      details = 'Additional team members being sent';
    } else {
      outcome = 'success';
      details = 'Rescue team is adequately equipped';
    }
  } else {
    outcome = 'success';
    details = 'Mild situation - standard protocols sufficient';
  }
  
  req.missionOutcome = outcome;
  req.missionDetails = details;
  next();
};

// Error Handler Middleware for rescue mission
const rescueErrorHandler = (err, req, res, next) => {
  console.error('Rescue Mission Error:', err.stack);
  res.status(500).json({ message: 'Error processing rescue mission', error: err.message });
};

// POST /rescue-mission - Handle rescue missions
app.post('/rescue-mission', 
  animalTypeCheck, 
  severityLevelCheck, 
  resourceAvailabilityCheck, 
  missionOutcomeDetermination, 
  (req, res, next) => {
    try {
      const mission = {
        id: rescueMissions.length + 1,
        animalType: req.animalType,
        severity: req.severity,
        outcome: req.missionOutcome,
        details: req.missionDetails,
        timestamp: new Date()
      };
      
      rescueMissions.push(mission);
      res.json({
        message: 'Rescue mission processed',
        outcome: req.missionOutcome,
        details: req.missionDetails
      });
    } catch (err) {
      next(err);
    }
  }
);

app.use(rescueErrorHandler);

// =======================
// Task 7: Library Book Management System
// =======================
let books = [
  { id: 1, title: "Clean Code", author: "Robert Martin" },
  { id: 2, title: "Introduction to Algorithms", author: "CLRS" }
];

// GET /books - View all books
app.get('/books', (req, res) => {
  res.json(books);
});

// GET /books/:id - View single book
app.get('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  res.json(book);
});

// POST /books - Add new book
app.post('/books', (req, res) => {
  const { id, title, author } = req.body;
  
  if (!id || !title || !author) {
    return res.status(400).json({ message: 'Invalid Request: Required fields missing' });
  }
  
  const newBook = { id, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

// PUT /books/:id - Update book
app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  
  const book = books.find(b => b.id === bookId);
  
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  if (title) book.title = title;
  if (author) book.author = author;
  
  res.json(book);
});

// DELETE /books/:id - Remove book
app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(b => b.id === bookId);
  
  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }
  
  const deletedBook = books.splice(bookIndex, 1);
  res.json({ message: 'Book deleted', book: deletedBook[0] });
});

// =======================
// Global Error Handler
// =======================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// =======================
// 404 Handler
// =======================
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start Server
app.listen(port, () => {
  console.log(`✓ Express server running at http://localhost:${port}`);
  console.log('\nAvailable endpoints:');
  console.log('\n--- Task 1: Course Registration ---');
  console.log('GET    /courses');
  console.log('GET    /courses/:id');
  console.log('POST   /courses');
  console.log('PUT    /courses/:id');
  console.log('DELETE /courses/:id');
  console.log('\n--- Task 2: Space Mission Management ---');
  console.log('GET    /astronauts');
  console.log('POST   /missions');
  console.log('GET    /missions/:missionName');
  console.log('DELETE /missions/:missionName');
  console.log('\n--- Task 3: Request Counter ---');
  console.log('GET    /stats');
  console.log('\n--- Task 5: Request Time ---');
  console.log('GET    /request-time');
  console.log('\n--- Task 6: Wildlife Rescue ---');
  console.log('POST   /rescue-mission');
  console.log('\n--- Task 7: Library Management ---');
  console.log('GET    /books');
  console.log('GET    /books/:id');
  console.log('POST   /books');
  console.log('PUT    /books/:id');
  console.log('DELETE /books/:id');
});
