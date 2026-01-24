import { useEffect, useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { RouteWrapper, WarningDialog } from 'rssa-study-template';
import { componentMap } from './pages/componentMap';
import './styles/App.css';

function App() {
    const [showWarning, setShowWarning] = useState<boolean>(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1200) {
                setShowWarning(true);
            } else if (window.innerWidth >= 1200) {
                setShowWarning(false);
            }
        };
        // Initial check
        handleResize();
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="text-center text-base font-light">
            {showWarning && (
                <WarningDialog
                    show={showWarning}
                    onClose={setShowWarning}
                    title="Warning"
                    message="Your window size is too small. Please maximize your window or use a larger screen."
                    disableHide={true}
                />
            )}
            <Router basename="/rssa-study/">
                <RouteWrapper componentMap={componentMap} WelcomePage={componentMap.WelcomeStep} />
            </Router>
        </div>
    );
}

export default App;
