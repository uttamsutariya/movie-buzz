import React from "react";
import ArrowLeftOutlinedIcon from "@mui/icons-material/ArrowLeftOutlined";

const BackButton = () => {
	return (
		<button
			onClick={() => {
				window.history.back();
			}}
			className="text-xl absolute top-3 left-5 text-blue-400 underline"
		>
			<ArrowLeftOutlinedIcon fontSize="small" />
			Back
		</button>
	);
};

export default BackButton;
