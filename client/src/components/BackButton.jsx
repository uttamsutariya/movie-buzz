import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";

const BackButton = () => {
	const navigate = useNavigate();

	return (
		<button
			onClick={() => navigate(-1)}
			className="text-xl absolute top-3 left-5 text-blue-400 underline"
		>
			<ArrowLeftOutlinedIcon fontSize="small" />
			Back
		</button>
	);
};

export default BackButton;
