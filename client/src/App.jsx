import { Routes, Route } from "react-router-dom";

// components
import Home from "./components/Home";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup";
import Booking from "./components/Booking/Booking";
import Movies from "./components/movie/Movies";
import MovieDetails from "./components/movie/MovieDetails";
import Error404 from "./components/404/Error404";
import UnAuthorized from "./components/404/UnAuthorized";
import Shows from "./components/shows/Shows";
import Feedback from "./components/Feedback/Feedback";
import AdminHome from "./components/admin-dashboard/AdminHome";
import AdminMovies from "./components/admin-dashboard/movies/Movies";
import AdminShows from "./components/admin-dashboard/shows/Shows";
import AdminFeedback from "./components/admin-dashboard/feedback/Feedback";
import MovieForm from "./components/admin-dashboard/movies/MovieForm";
import ShowForm from "./components/admin-dashboard/shows/ShowForm";
import ShowDetails from "./components/admin-dashboard/shows/ShowDetails";
import ShowHistory from "./components/admin-dashboard/shows/ShowHistory";
import CinemaHall from "./components/admin-dashboard/cinemaHall/CinemaHall";
import CinemaHallForm from "./components/admin-dashboard/cinemaHall/CinemaHallForm";
import AdminWelcome from "./components/admin-dashboard/AdminWelcome";
import SeatSelector from "./components/shows/SeatSelector";
import PrivateRoute from "./components/PrivateRoute";
import PersistLogin from "./components/PersistLogin";
import ForgotPass from "./components/auth/ForgotPass";
import ResetPass from "./components/auth/ResetPass";

const App = () => {
	return (
		<Routes>
			<Route element={<PersistLogin />}>
				{/* public routes */}
				<Route path="/" element={<Home />} />
				<Route path="/login" element={<Login />} />
				<Route path="/signup" element={<Signup />} />
				<Route path="/movies" element={<Movies />} />
				<Route path="/movies/details/:id" element={<MovieDetails />} />
				<Route path="/shows/:id" element={<Shows />} />
				<Route path="/user/forgot-password" element={<ForgotPass />} />
				<Route path="/user/reset-password/:userId/:token" element={<ResetPass />} />

				{/* protected routes for user */}
				<Route element={<PrivateRoute allowedRoles={[0, 1]} />}>
					<Route path="/shows/seat-map/:id" element={<SeatSelector />} />
					<Route path="/bookings" element={<Booking />} />
					<Route path="/feedback" element={<Feedback />} />
				</Route>

				{/* protected routes for admin */}
				<Route element={<PrivateRoute allowedRoles={[1]} />}>
					<Route path="/admin" element={<AdminHome />}>
						<Route path="" element={<AdminWelcome />} />
						<Route path="movies" element={<AdminMovies />} />
						<Route path="movies/add" element={<MovieForm />} />
						<Route path="shows" element={<AdminShows />} />
						<Route path="shows/history" element={<ShowHistory />} />
						<Route path="shows/add" element={<ShowForm />} />
						<Route path="shows/update/:id" element={<ShowForm update={true} />} />
						<Route path="shows/:id" element={<ShowDetails />} />
						<Route path="feedbacks" element={<AdminFeedback />} />
						<Route path="cinemahalls" element={<CinemaHall />} />
						<Route path="cinemahalls/add" element={<CinemaHallForm />} />
					</Route>
				</Route>

				{/* unauthorized */}
				<Route path="/unauthorized" element={<UnAuthorized />} />

				{/* 404 page */}
				<Route path="*" element={<Error404 />} />
			</Route>
		</Routes>
	);
};

export default App;
