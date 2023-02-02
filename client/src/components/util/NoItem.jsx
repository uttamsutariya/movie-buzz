import React from "react";

const NoItem = ({ item }) => {
	return (
		<div className="p-10 md:p-20 flex justify-center items-center border-solid border-4 border-red-400 rounded-lg">
			<p className="text-2xl md:text-4xl font-semibold text-red-200">{item}</p>
		</div>
	);
};

export default NoItem;
