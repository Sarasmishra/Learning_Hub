import { createBrowserRouter } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import Navbar from './components/ui/navbar'
import Login from './pages/login'
import MainLayout from './layout/MainLLayout'
import HeroSection from './pages/student/HeroSection'
import { RouterProvider } from 'react-router'
import Courses from './pages/student/courses'
import MyLearning from './pages/student/Mylearning'
import Profile from './pages/student/Profile'
import Sidebar from './pages/admin/Sidebar'
import Dashboard from './pages/admin/Dashboard'
import CourseTable from './pages/admin/course/CourseTable'
import AddCourse from './pages/admin/course/AddCourse'
import EditCourse from './pages/admin/course/EditCourse'
import CreateLecture from './pages/admin/lecture/CreateLecture'
import EditLecture from './pages/admin/lecture/EditLecture'
import CourseDetail from './pages/student/CourseDetail'
import CourseProgress from './pages/student/CourseProgress'

import SearchPage from './pages/student/SearchPage'
import { AdminRoute, AuthenticatedUser, ProtectedRoute } from './components/ProtectedRoute'
import PurchaseCourseProtectedRoute from './components/PurchasedCourseProtectedRoute'
import { ThemeProvider } from './components/ThemeProvider'
import AssignmentsPage from './pages/student/AssignmentPage'
import AssignmentsTable from './pages/admin/Assignment/AssignmentTable'
import CreateAssignmentPage from './pages/admin/Assignment/CreateAssignmentPage'
import EditAssignmentPage from './pages/admin/Assignment/EditAssignmentPage'
import AssignmentDetails from './pages/student/AssignmentDetails'

const appRouter = createBrowserRouter([
  {
    path:"/",
    element:<MainLayout/>,
    children:[
      {
        path:"/",
        element:(
          <ProtectedRoute>
            <>
        <HeroSection/>
        <Courses/>
        </>
        </ProtectedRoute>

        )
      },
      {
        path: "login",
        element:<AuthenticatedUser> <Login /></AuthenticatedUser>
      },
      {
        path: "my-learning",
        element: <ProtectedRoute><MyLearning /></ProtectedRoute>
      },
      {
        path: "profile",
        element: <ProtectedRoute><Profile /></ProtectedRoute>
      },
      {
        path: "course/search",
        element: <ProtectedRoute> <SearchPage /></ProtectedRoute>
      },
      {
        path: "course-detail/:courseId",
        element:<ProtectedRoute><CourseDetail/></ProtectedRoute> 
      },
      {
        path: "course-progress/:courseId",
        element:<ProtectedRoute><PurchaseCourseProtectedRoute><CourseProgress/></PurchaseCourseProtectedRoute></ProtectedRoute>
      },
      {
        path: "course-progress/:courseId/assignments",
        element: <ProtectedRoute><AssignmentsPage /></ProtectedRoute>
      },
      {
        path:"course-progress/:courseId/assignments/:type/:assignmentId",
        element:<AssignmentDetails/>
      },
      // admin routes start from here
      {
        path: "admin",
        element: (

           <AdminRoute><Sidebar /></AdminRoute> 
        ),
        children:[{
          path:"dashboard",
          element:<Dashboard/>
        },
        {
          path:"course",
          element:<CourseTable/>

        },
        {
          path:"course/create",
          element:<AddCourse/>

        },
        {
          path:"course/:courseId",
          element:<EditCourse/>

        },
        {
          path:"course/:courseId/lecture",
          element:<CreateLecture/>

        },
        {
          path:"course/:courseId/lecture/:lectureId",
          element:<EditLecture/>

        },
        {
          path:'assignments',
          element:<AssignmentsTable/>
        },
        {
          path:'assignments/create',
          element:<CreateAssignmentPage/>
        },
        {
          path:"assignments/edit/:type/:id",
          element:<EditAssignmentPage/>
        },

        ]
      }

    ]
  }
])

function App() {

  return (
    <main>
      <ThemeProvider>
      <RouterProvider router={appRouter}></RouterProvider>
      </ThemeProvider>
      
    </main>
  )
}

export default App
