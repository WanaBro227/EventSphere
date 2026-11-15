# EventSphere – Venue Booking and Digital Ticketing Platform

<p align="center">
  <strong>A Multi-Agent Web-Based Event Management System</strong>
</p>

<p align="center">
  <a href="https://eventsphere-frontend-smoky.vercel.app/">Live Application</a> •
  <a href="https://github.com/WanaBro227/EventSphere">GitHub Repository</a>
</p>

---

## 1. Project Overview

**EventSphere** is a web-based venue booking and digital ticketing platform developed to simplify event management, venue reservations, ticket booking, and event entry validation.

The platform provides a centralized environment where administrators can manage venues and events, attendees can discover events and book tickets, and staff members can validate digital tickets using QR codes.

A key aspect of EventSphere is its **Multi-Agent System (MAS)** architecture. The application incorporates four specialized software agents that cooperate through a structured messaging system to handle different business operations.

The four agents are:

- **BookingAgent** – Manages ticket booking requests and availability.
- **TicketAgent** – Handles digital ticket generation and validation.
- **WaitlistAgent** – Manages users waiting for unavailable tickets.
- **NotificationAgent** – Handles event-related notifications.

The system demonstrates how agent-based computing can be integrated into a practical web application.

## 2. Project Information

| Detail | Information |
|---|---|
| Project Name | EventSphere |
| Course Code | IT 4123 |
| Course | Agent Based Computing |
| Assessment | Practical Individual Continuous Assessment 02 |
| Student Name | Wanasinghe DWMDC |
| Registration Number | 2021/ICT/34 |
| Backend Framework | FastAPI |
| Frontend | HTML, CSS, JavaScript, Bootstrap |
| Database | PostgreSQL / SQLite |
| Deployment | Vercel, Render, Neon |

## 3. Live Application

The application is deployed using cloud hosting services.

| Component | Platform | Link |
|---|---|---|
| Frontend | Vercel | [Open EventSphere](https://eventsphere-frontend-smoky.vercel.app/) |
| Backend | Render | Add your deployed Render URL |
| Database | Neon PostgreSQL | Private database connection |
| Source Code | GitHub | [EventSphere Repository](https://github.com/WanaBro227/EventSphere) |

> **Note:** The backend URL should be added after confirming the public Render service URL. Database connection details and credentials must never be published.

## 4. Main Features

### 4.1 User Management and Authentication

- User registration and login.
- JWT-based authentication.
- Password hashing for secure password storage.
- Role-based access control.
- Separate permissions for administrators, staff members, and attendees.
- Protected API endpoints.

### 4.2 Venue Management

- Create and manage venue information.
- Maintain venue details and availability.
- Support venue-related administration.
- Allow users to submit venue hire requests.

### 4.3 Event Management

- Create and manage events.
- Display event information to users.
- Manage event-related details.
- Support ticket booking for available events.

### 4.4 Ticket Booking

- Submit ticket booking requests.
- Check ticket availability.
- Manage booking information.
- Maintain booking references and statuses.
- Prevent bookings from exceeding available ticket capacity.

### 4.5 Digital Ticketing and QR Code Validation

- Generate digital tickets for successful bookings.
- Associate tickets with booking information.
- Generate QR codes for ticket identification.
- Allow authorized staff to validate tickets.
- Support duplicate check-in prevention.

### 4.6 Waitlist Management

- Allow users to join waitlists when tickets are unavailable.
- Maintain waitlist information.
- Process eligible waitlist entries when availability changes.
- Support expiry checking.

### 4.7 Venue Hire Management

- Allow users to submit venue hire requests.
- Store submitted request information.
- Provide administrative request management.

### 4.8 Agent Monitoring

- Monitor agent activities.
- Maintain structured agent communication records.
- Support observation of agent operations and message exchanges.

## 5. Multi-Agent System Architecture

EventSphere uses a multi-agent architecture to distribute application responsibilities among specialized software agents.

Each agent is responsible for a particular business process. Agents communicate through a centralized messaging mechanism rather than directly calling one another.

### 5.1 BookingAgent

The BookingAgent manages ticket booking operations.

**Responsibilities:**

- Receive booking requests.
- Check booking information and ticket availability.
- Coordinate booking-related operations.
- Handle successful and unsuccessful booking responses.
- Help prevent ticket overbooking.

### 5.2 TicketAgent

The TicketAgent manages digital ticket operations.

**Responsibilities:**

- Handle ticket-related requests.
- Generate digital tickets for eligible bookings.
- Support QR-code-based ticket identification.
- Validate tickets during event entry.
- Prevent duplicate ticket validation.

### 5.3 WaitlistAgent

The WaitlistAgent manages users waiting for ticket availability.

**Responsibilities:**

- Process waitlist requests.
- Maintain waitlist entries.
- Check eligible waitlist records.
- Support waitlist processing when ticket availability changes.
- Perform scheduled expiry checks.

### 5.4 NotificationAgent

The NotificationAgent manages notifications generated by application activities.

**Responsibilities:**

- Receive notification-related messages.
- Process relevant booking and ticket updates.
- Handle waitlist-related notification events.
- Support communication with users through the configured notification mechanism.

### 5.5 Agent Communication

Agents exchange structured messages through the messaging system.

Each message contains the following information:

| Field | Description |
|---|---|
| Sender | Agent or component sending the message |
| Receiver | Intended message recipient |
| Performative | Type of communication |
| Content | Information carried by the message |
| Conversation ID | Identifier used to associate related messages |

The system supports the following performatives:

| Performative | Purpose |
|---|---|
| REQUEST | Request another agent to perform an operation |
| AGREE | Indicate acceptance of a request |
| REFUSE | Reject a request |
| PROPOSE | Suggest an action or response |
| INFORM | Communicate information |
| FAILURE | Report an unsuccessful operation |

This communication structure supports coordination, traceability, and separation of responsibilities between agents.

## 6. System Architecture

EventSphere follows a client-server architecture integrated with a multi-agent communication layer.

```text
                 USERS
                   |
                   v
          FRONTEND APPLICATION
        HTML / CSS / JavaScript
              Bootstrap
                   |
                   | HTTP / REST API
                   v
           FASTAPI BACKEND
                   |
        +----------+----------+
        |          |          |
        v          v          v
   Authentication  Business  API Routers
                    Logic
        |
        v
   AGENT MESSAGING SYSTEM
        |
   +----+----------+----------------+
   |               |                |
   v               v                v
BookingAgent   TicketAgent     WaitlistAgent
   |               |                |
   +---------------+----------------+
                   |
                   v
           NotificationAgent
                   |
                   v
              DATABASE
          PostgreSQL / SQLite
```

### Technology Layers

1. **Presentation Layer:** Provides the user interface using HTML, CSS, JavaScript, and Bootstrap.
2. **Application Layer:** Uses FastAPI to handle HTTP requests, authentication, and application logic.
3. **Agent Layer:** Coordinates independent agents through structured messages.
4. **Data Layer:** Uses SQLAlchemy and relational database storage for persistent application data.

## 7. Technologies and Tools

| Technology | Purpose |
|---|---|
| Python | Backend programming language |
| FastAPI | REST API development |
| Pydantic | Request and response data validation |
| SQLAlchemy | Database ORM |
| PostgreSQL | Production database |
| SQLite | Local development database |
| HTML5 | Frontend structure |
| CSS3 | Frontend styling |
| JavaScript | Frontend functionality |
| Bootstrap | Responsive UI components |
| JWT | Authentication |
| QR Code Library | Digital ticket identification |
| Pytest | Backend testing |
| Git | Version control |
| GitHub | Source code management |
| Render | Backend hosting |
| Neon | Managed PostgreSQL hosting |
| Vercel | Frontend hosting |

## 8. Project Folder Structure

The project is organized into separate frontend and backend directories.

```text
EventSphere/
│
├── backend/
│   │
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── config.py
│   │   ├── database.py
│   │   │
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── agents/
│   │   └── messaging/
│   │
│   ├── tests/
│   ├── requirements.txt
│   ├── .env
│   └── .env.example
│
├── frontend/
│   │
│   ├── index.html
│   ├── login.html
│   ├── register.html
│   ├── events.html
│   ├── event-details.html
│   ├── booking.html
│   ├── my-tickets.html
│   ├── waitlist.html
│   ├── venue-hire.html
│   ├── dashboard.html
│   ├── scanner.html
│   │
│   ├── admin/
│   │   ├── dashboard.html
│   │   ├── venues.html
│   │   ├── events.html
│   │   ├── bookings.html
│   │   ├── venue-hire-requests.html
│   │   └── agent-monitor.html
│   │
│   ├── staff/
│   │   └── scanner.html
│   │
│   ├── css/
│   ├── js/
│   └── assets/
│
├── README.md
├── .gitignore
└── render.yaml
```

> The structure above represents the main project organization. Some directories may contain additional modules and files.

## 9. Installation and Local Setup

Follow these instructions to run EventSphere locally.

### Prerequisites

Install the following software:

- Python 3.11 or later.
- Git.
- Visual Studio Code or another code editor.
- A supported database (SQLite for local development or PostgreSQL).
- A modern web browser.

### Step 1: Clone the Repository

Open a terminal and execute:

```bash
git clone https://github.com/WanaBro227/EventSphere.git
```

Navigate into the project directory:

```bash
cd EventSphere
```

### Step 2: Create a Python Virtual Environment

Navigate to the project root and create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows PowerShell:

```powershell
.\venv\Scripts\Activate.ps1
```

For Linux or macOS:

```bash
source venv/bin/activate
```

### Step 3: Install Backend Dependencies

Navigate to the backend directory:

```bash
cd backend
```

Install the required packages:

```bash
pip install -r requirements.txt
```

### Step 4: Configure Environment Variables

Create a `.env` file inside the `backend` directory.

Use the project's `.env.example` as a reference.

Example configuration:

```env
DATABASE_URL=sqlite:///./eventsphere.db

SECRET_KEY=replace_with_a_secure_random_secret

ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30
```

> These are illustrative settings. Use the exact variable names and supported values defined in `backend/app/config.py`. For PostgreSQL, replace the SQLite database URL with your PostgreSQL connection URL.

Never commit your actual `.env` file or production credentials to GitHub.

### Step 5: Start the Backend Server

From the `backend` directory, execute:

```bash
python -m uvicorn app.main:app --reload
```

The backend should be accessible at:

```text
http://127.0.0.1:8000
```

FastAPI API documentation:

```text
http://127.0.0.1:8000/docs
```

Alternative API documentation:

```text
http://127.0.0.1:8000/redoc
```

### Step 6: Start the Frontend

Open another terminal from the project root.

Run the following command:

```bash
python -m http.server 5500 --directory frontend
```

Open the frontend in your browser:

```text
http://127.0.0.1:5500
```

Make sure the frontend API configuration points to the local backend while testing locally.

## 10. Database Configuration

EventSphere supports SQLite for local development and PostgreSQL for production deployment.

### SQLite

SQLite provides a lightweight database option for local development.

Example:

```env
DATABASE_URL=sqlite:///./eventsphere.db
```

### PostgreSQL

PostgreSQL is used for the production environment.

The database can be hosted through Neon PostgreSQL or another compatible PostgreSQL service.

Configure the database connection using the environment variable:

```env
DATABASE_URL=your_postgresql_connection_string
```

The actual connection string must be kept private.

## 11. API Documentation

The backend provides RESTful API endpoints through FastAPI.

The interactive API documentation is available at:

```text
http://127.0.0.1:8000/docs
```

After deployment, use:

```text
YOUR_RENDER_BACKEND_URL/docs
```

The API is organized around application responsibilities, including:

- Authentication and user management.
- Venue management.
- Event management.
- Ticket booking.
- Digital tickets.
- Waitlist management.
- Venue hire requests.
- Agent communication and monitoring.

Refer to the interactive Swagger documentation for the actual available endpoint paths, request formats, and response structures.

## 12. Testing

EventSphere uses **Pytest** for backend testing.

Testing focuses on verifying application functionality, agent communication, and important business rules.

### Important Test Scenarios

| Test Area | Purpose |
|---|---|
| Authentication | Verify registration and login |
| Authorization | Verify role-based access restrictions |
| Booking | Verify valid booking operations |
| Overbooking | Ensure ticket capacity is not exceeded |
| Ticket Management | Verify ticket-related operations |
| Duplicate Check-in | Prevent repeated ticket validation |
| BookingAgent | Verify booking request processing |
| TicketAgent | Verify ticket operations |
| WaitlistAgent | Verify waitlist processing |
| NotificationAgent | Verify notification message handling |

### Execute Tests

From the backend directory:

```bash
pytest -v
```

For a more detailed test report:

```bash
pytest -v -ra
```

Only tests that have actually been executed should be reported as passed.

## 13. Deployment

EventSphere is deployed using cloud-based hosting services.

### Frontend Deployment – Vercel

The frontend is hosted on Vercel.

Deployment configuration:

- Framework: Other / Static HTML.
- Root Directory: `frontend`.
- Build Command: Not required.
- Output Directory: `.`

Live frontend:

https://eventsphere-frontend-smoky.vercel.app/

### Backend Deployment – Render

The FastAPI backend is hosted on Render.

Typical deployment configuration:

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `pip install -r requirements.txt` |
| Start Command | `uvicorn app.main:app --host 0.0.0.0 --port $PORT` |

Configure the required production environment variables in the Render dashboard.

### Database Deployment – Neon

Neon PostgreSQL is used as the production database.

The PostgreSQL connection string is configured in the backend environment variables.

### Important Deployment Configuration

Ensure that:

- The frontend uses the public Render backend URL.
- The backend CORS configuration allows the deployed Vercel frontend origin.
- Production database credentials are stored securely.
- JWT secrets are not exposed in frontend code.
- HTTPS is used for public application access.

## 14. User Roles

EventSphere supports three main user roles.

| Role | Responsibilities |
|---|---|
| Admin | Manage platform information, venues, events, bookings, and administrative operations |
| Staff | Perform authorized event-entry and ticket validation operations |
| Attendee | Browse events, book tickets, access digital tickets, and use supported user services |

Access to protected operations is controlled by backend authentication and authorization.

## 15. Security Considerations

The application incorporates several security practices:

- Password hashing rather than plain-text password storage.
- JWT-based authentication.
- Role-based authorization.
- Protected backend API operations.
- Environment-based configuration.
- Backend-side request validation.
- CORS configuration for approved frontend origins.
- Server-side ticket validation.

Production secrets, database credentials, and private configuration files must not be included in the public repository.

## 16. Future Improvements

Possible future enhancements include:

- Integration with a real payment gateway.
- More advanced event recommendation features.
- Real-time notification delivery.
- Advanced analytics and reporting.
- Improved agent performance monitoring.
- Additional automated integration tests.
- Persistent file storage for generated ticket assets.
- Enhanced mobile user experience.

## 17. Project Links

| Resource | Link |
|---|---|
| Live Frontend | https://eventsphere-frontend-smoky.vercel.app/ |
| GitHub Repository | https://github.com/WanaBro227/EventSphere |
| Backend API | Add Render backend URL |
| API Documentation | Add deployed backend URL followed by `/docs` |

## 18. Academic Context

This project was developed as part of the practical assessment for the following course:

**Course:** Agent Based Computing  
**Course Code:** IT 4123  
**Assessment:** Practical Individual Continuous Assessment 02

**Student:** Wanasinghe DWMDC  
**Registration Number:** 2021/ICT/34

The project demonstrates the practical application of multi-agent systems, structured inter-agent communication, web application development, database integration, authentication, and cloud deployment.

## 19. License

This repository was developed as an academic project for the University of Vavuniya.

Unless a separate license is added to this repository, all rights are reserved by the project author(s). Reuse and redistribution should be subject to the applicable academic and institutional requirements.

---

<p align="center">
  <strong>EventSphere – Simplifying Event and Venue Management</strong>
  <br>
  Developed for IT 4123 – Agent Based Computing
</p>