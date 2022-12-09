import { NavLink, Link, Outlet } from "react-router-dom";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DoorSlidingOutlinedIcon from "@mui/icons-material/DoorSlidingOutlined";
import { logout, useAuthDispatch } from "../../context";

const AdminHome = () => {
	const dispatch = useAuthDispatch();

	return (
		<div className="flex">
			<div className="h-[100vh] flex flex-col w-[18%] px-4 py-8 bg-slate-800 border-r ">
				<Link to={"/admin"} className="text-3xl text-center text-white">
					uMovies
				</Link>
				<div>
					<nav className="flex flex-col justify-start flex-1 mt-6 space-y-3">
						<NavLink
							className={(navData) =>
								navData.isActive ? `${styles.active_link}` : `${styles.normal_link}`
							}
							to="/admin/movies"
						>
							<MovieFilterOutlinedIcon />

							<span className="mx-4 font-medium">Movies</span>
						</NavLink>
						<NavLink
							className={(navData) =>
								navData.isActive ? `${styles.active_link}` : `${styles.normal_link}`
							}
							to={"/admin/shows"}
						>
							<TheatersOutlinedIcon />

							<span className="mx-4 font-medium">Shows</span>
						</NavLink>
						<NavLink
							className={(navData) =>
								navData.isActive ? `${styles.active_link}` : `${styles.normal_link}`
							}
							to={"/admin/cinemahalls"}
						>
							<DoorSlidingOutlinedIcon />

							<span className="mx-4 font-medium">Cinemahalls</span>
						</NavLink>
						<NavLink
							className={(navData) =>
								navData.isActive ? `${styles.active_link}` : `${styles.normal_link}`
							}
							to={"/admin/feedbacks"}
						>
							<RateReviewOutlinedIcon />

							<span className="mx-4 font-medium">Feedbacks</span>
						</NavLink>
						<div onClick={() => logout(dispatch)} className={styles.normal_link}>
							<LogoutOutlinedIcon />

							<span className="mx-4 font-medium">Logout</span>
						</div>
					</nav>
				</div>
			</div>
			<div className="w-[82%]">{<Outlet />}</div>
		</div>
	);
};

const styles = {
	normal_link: "flex items-center px-4 py-2 rounded-lg cursor-pointer text-gray-400 hover:text-white hover:bg-mygray",
	active_link: "flex items-center px-4 py-2 rounded-lg cursor-pointer bg-blue-600 text-white hover:text-white",
};

export default AdminHome;
