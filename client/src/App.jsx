import { HashRouter, Routes, Route } from "react-router-dom";

// components
import Home from "./components/Home";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup";
import Booking from "./components/Booking/Booking";
import Movies from "./components/movie/Movies";
import MovieDetails from "./components/movie/MovieDetails";
import Error404 from "./components/404/Error404";
import Shows from "./components/shows/Shows";
import Feedback from "./components/Feedback/Feedback";
import AdminHome from "./components/admin-dashboard/AdminHome";
import AdminMovies from "./components/admin-dashboard/movies/Movies";
import AdminShows from "./components/admin-dashboard/shows/Shows";
import AdminFeedback from "./components/admin-dashboard/feedback/Feedback";
import MovieForm from "./components/admin-dashboard/movies/MovieForm";
import ShowForm from "./components/admin-dashboard/shows/ShowForm";
import ShowDetails from "./components/admin-dashboard/shows/ShowDetails";
import CinemaHall from "./components/admin-dashboard/cinemaHall/CinemaHall";
import CinemaHallForm from "./components/admin-dashboard/cinemaHall/CinemaHallForm";
import AdminWelcome from "./components/admin-dashboard/AdminWelcome";
import SeatSelector from "./components/shows/SeatSelector";
import PrivateRoute from "./components/PrivateRoute";

// toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// auth provider
import { AuthProvider } from "./context";

const App = () => {
	return (
		<AuthProvider>
			<ToastContainer
				autoClose={2000}
				hideProgressBar={true}
				newestOnTop={true}
				closeOnClick={false}
				closeButton={false}
				limit={1}
			/>
			<HashRouter>
				<Routes>
					{/* user routes */}
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/movies" element={<Movies />} />
					<Route path="/shows/:id" element={<Shows />} />
					<Route path="/movies/details/:id" element={<MovieDetails />} />
					<Route path="/shows/seat-map/:id" element={<SeatSelector />} />
					{/* protected routes */}
					<Route element={<PrivateRoute />}>
						<Route path="/bookings" element={<Booking />} />
						<Route path="/feedback" element={<Feedback />} />

						{/* admin route */}
						<Route path="/admin" element={<AdminHome />}>
							<Route path="" element={<AdminWelcome />} />
							<Route path="movies" element={<AdminMovies />} />
							<Route path="movies/add" element={<MovieForm />} />
							<Route path="shows" element={<AdminShows />} />
							<Route path="shows/add" element={<ShowForm />} />
							<Route path="shows/update/:id" element={<ShowForm update={true} />} />
							<Route path="shows/:id" element={<ShowDetails />} />
							<Route path="feedbacks" element={<AdminFeedback />} />
							<Route path="cinemahalls" element={<CinemaHall />} />
							<Route path="cinemahalls/add" element={<CinemaHallForm />} />
						</Route>
					</Route>

					<Route path="*" element={<Error404 />} />
				</Routes>
			</HashRouter>
		</AuthProvider>
	);
};

export default App;
