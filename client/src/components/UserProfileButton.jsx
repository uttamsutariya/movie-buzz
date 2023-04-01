import { useState, useRef, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import StyleOutlinedIcon from "@mui/icons-material/StyleOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import { Link, useNavigate } from "react-router-dom";

import { logout, useAuthDispatch } from "../context";

let useClickOutside = (handler) => {
	let domNode = useRef();

	useEffect(() => {
		let menuCloseHandler = (e) => {
			if (!domNode.current.contains(e.target)) handler();
		};

		document.addEventListener("mousedown", menuCloseHandler);

		return () => {
			document.removeEventListener("mousedown", menuCloseHandler);
		};
	});

	return domNode;
};

const User = ({ icon }) => {
	const [isOpen, setIsOpen] = useState(false);
	const dispatch = useAuthDispatch();
	const navigate = useNavigate();

	let menuRef = useClickOutside(() => setIsOpen(false));

	return (
		<div>
			<div ref={menuRef} className="relative inline-block text-left">
				<div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
					<Avatar
						sx={{
							backgroundColor: "#2563EB",
							color: "black",
						}}
					>
						<p className="font-extrabold text-white">{icon}</p>
					</Avatar>
				</div>
				{isOpen ? (
					<div className={styles.link_div_container}>
						<div>
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
							<div
								onClick={() => {
									logout(dispatch);
									navigate("/");
								}}
								className={styles.linkItem}
							>
								<span className="flex flex-col">
									<span>
										<LogoutRoundedIcon className="mr-5" />
										Logout{" "}
									</span>
								</span>
							</div>
						</div>
					</div>
				) : null}
			</div>
		</div>
	);
};

const styles = {
	linkItem:
		"block px-2 p-1 cursor-pointer text-md text-mygray border-b-2 border-solid border-mygray rounded-md hover:bg-gray-200 hover:overflow-hidden",
	link_div_container: "origin-top-right absolute right-0 mt-2 w-48 rounded-md bg-white",
};

export default User;
