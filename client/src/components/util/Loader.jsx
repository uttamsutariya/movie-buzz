import BackButton from "./BackButton";
import LoaderSvg from "../../assets/images/loading3.svg";

const Loader = ({ msg }) => {
	return (
		<div className="h-[100vh] flex justify-center items-center relative">
			{msg === "loading" ? (
				<img src={LoaderSvg} alt="" />
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
