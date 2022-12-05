import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Link } from "react-router-dom";

const styles = {
	linkItem:
		"block px-2 p-1 text-md text-mygray border-b-2 border-solid border-mygray hover:bg-mygray hover:text-white",
};

const User = () => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<div>
			<div className="relative inline-block text-left">
				<div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
					<Avatar
						sx={{
							backgroundColor: "#2563EB",
							color: "black",
						}}
					>
						<p className="font-extrabold text-white">U</p>
					</Avatar>
				</div>
				{isOpen ? (
					<div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md bg-white">
						<div className="" role="menu">
							<Link to={"/bookings"} className={styles.linkItem}>
								<span className="flex flex-col">
									<span>
										<StyleOutlinedIcon className="mr-5" />
										My Bookings
									</span>
								</span>
							</Link>
							<Link to={"/feedback"} className={styles.linkItem}>
								<span className="flex flex-col">
									<span>
										<TextsmsOutlinedIcon className="mr-5" />
										Give Feedback
									</span>
								</span>
							</Link>
							<Link to={"#"} className={styles.linkItem}>
								<span className="flex flex-col">
									<span>
										<LogoutRoundedIcon className="mr-5" />
										Logout{" "}
									</span>
								</span>
							</Link>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

export default User;
