import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { HashRouter } from "react-router-dom";

//  provider
import { AuthProvider, MoviesProvider } from "./context";

// toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<AuthProvider>
			<MoviesProvider>
				<HashRouter>
					<ToastContainer
						autoClose={3000}
						hideProgressBar={true}
						newestOnTop={true}
						closeOnClick={true}
						closeButton={false}
						limit={2}
					/>
					<App />
				</HashRouter>
			</MoviesProvider>
		</AuthProvider>
	</React.StrictMode>
);
