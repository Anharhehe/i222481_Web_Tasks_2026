# Task 1: Course Registration API
(Invoke-WebRequest -Uri "http://localhost:3001/courses" -Method GET).Content
(Invoke-WebRequest -Uri "http://localhost:3001/courses/1" -Method GET).Content
$body = @{id=3;name="AI";seats=20} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/courses" -Method POST -ContentType "application/json" -Body $body).Content
$body = @{seats=35} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/courses/1" -Method PUT -ContentType "application/json" -Body $body).Content
(Invoke-WebRequest -Uri "http://localhost:3001/courses/1" -Method DELETE).Content

# Task 2: Space Mission Crew Management
(Invoke-WebRequest -Uri "http://localhost:3001/astronauts" -Method GET).Content
$body = @{missionName="Mars Explorer";crew=@("Ayesha Khan","Dr. Sara Chen")} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/missions" -Method POST -ContentType "application/json" -Body $body).Content
(Invoke-WebRequest -Uri "http://localhost:3001/missions/Mars Explorer" -Method GET).Content
(Invoke-WebRequest -Uri "http://localhost:3001/missions/Mars Explorer" -Method DELETE).Content

# Task 3: Request Counter
(Invoke-WebRequest -Uri "http://localhost:3001/stats" -Method GET).Content

# Task 4: Validation Test (should show error)
$body = @{missionName="Test"} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/missions" -Method POST -ContentType "application/json" -Body $body -ErrorAction SilentlyContinue).Content

# Task 5: Request Time
(Invoke-WebRequest -Uri "http://localhost:3001/request-time" -Method GET).Content

# Task 6: Wildlife Rescue
$body = @{animalType="mammal";severity="moderate"} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/rescue-mission" -Method POST -ContentType "application/json" -Body $body).Content
$body = @{animalType="reptile";severity="severe"} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/rescue-mission" -Method POST -ContentType "application/json" -Body $body).Content

# Task 7: Library Management
(Invoke-WebRequest -Uri "http://localhost:3001/books" -Method GET).Content
(Invoke-WebRequest -Uri "http://localhost:3001/books/1" -Method GET).Content
$body = @{id=3;title="Design Patterns";author="Gang of Four"} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/books" -Method POST -ContentType "application/json" -Body $body).Content
$body = @{title="Clean Code Vol 2"} | ConvertTo-Json; (Invoke-WebRequest -Uri "http://localhost:3001/books/1" -Method PUT -ContentType "application/json" -Body $body).Content
(Invoke-WebRequest -Uri "http://localhost:3001/books/1" -Method DELETE).Content