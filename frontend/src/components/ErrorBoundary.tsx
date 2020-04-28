import * as React from 'react';
import { Navigate } from 'react-router-dom';

export class ErrorBoundary extends React.Component<{}, { hasError: boolean; error: any }> {
	state = {
		hasError: false,
		error: null
	};

	static getDerivedStateFromError(error: any) {
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError && this.state.error?.response?.status === 401) {
			return <Navigate to={'/login'} />;
		}

		if (this.state.hasError) {
			return <div>An unexpected error has occurred.</div>;
		}

		return this.props.children;
	}
}
