import * as React from 'react';

export class ErrorBoundary extends React.Component<{}, { hasError: boolean }> {
	state = {
		hasError: false
	};

	static getDerivedStateFromError(error: any) {
		console.error(error);
		return { hasError: true };
	}

	render() {
		if (this.state.hasError) {
			return <div>An unexpected error has occurred.</div>;
		}

		return this.props.children;
	}
}
