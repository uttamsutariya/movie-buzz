import BackButton from "./BackButton";

const Loader = ({ msg }) => {
	return (
		<div className="h-[100vh] flex justify-center items-center relative">
			{msg === "loading" ? (
				<h1 className="text-4xl font-extrabold">Loading . . .</h1>
			) : (
				<>
					<BackButton />
					<h1 className="text-4xl font-extrabold">Something went wrong 💥</h1>
				</>
			)}
		</div>
	);
};

export default Loader;
