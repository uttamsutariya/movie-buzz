import { NavLink, Link, Outlet } from "react-router-dom";
import MovieFilterOutlinedIcon from "@mui/icons-material/MovieFilterOutlined";
import TheatersOutlinedIcon from "@mui/icons-material/TheatersOutlined";
import RateReviewOutlinedIcon from "@mui/icons-material/RateReviewOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DoorSlidingOutlinedIcon from "@mui/icons-material/DoorSlidingOutlined";

const navLinks = [
	{
		icon: <MovieFilterOutlinedIcon />,
		name: "Movies",
		link: "/admin/movies",
	},
	{
		icon: <TheatersOutlinedIcon />,
		name: "Shows",
		link: "/admin/shows",
	},
	{
		icon: <DoorSlidingOutlinedIcon />,
		name: "Cinema Hall",
		link: "/admin/cinemahalls",
	},
	{
		icon: <RateReviewOutlinedIcon />,
		name: "Feedbacks",
		link: "/admin/feedbacks",
	},
	{
		icon: <LogoutOutlinedIcon />,
		name: "Logout",
		link: "/logout",
	},
];

const styles = {
	normal_link: "flex items-center px-4 py-2 rounded-lg  text-gray-400 hover:text-white hover:bg-mygray",
	active_link: "flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:text-white",
};

const AdminHome = ({ child }) => {
	return (
		<div className="flex">
			<div className="h-[100vh] flex flex-col w-[18%] px-4 py-8 bg-slate-800 border-r ">
				<Link to={"/admin"} className="text-3xl text-center text-white">
					uMovies
				</Link>
				<div>
					<nav className="flex flex-col justify-start flex-1 mt-6 space-y-3">
						{navLinks.map(({ icon, name, link }, index) => (
							<NavLink
								className={(navData) =>
									navData.isActive ? `${styles.active_link}` : `${styles.normal_link}`
								}
								to={link}
								key={index}
							>
								{icon}

								<span className="mx-4 font-medium">{name}</span>
							</NavLink>
						))}
					</nav>
				</div>
			</div>
			<div className="w-[82%]">{<Outlet />}</div>
		</div>
	);
};

export default AdminHome;
