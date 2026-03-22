import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';

export default function NotFound() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState([]);
  const [progressWidth, setProgressWidth] = useState('0%'); // FIX: Added state for progress bar

  useEffect(() => {
    const timeouts = [];

    const terminalLogs = [
      { text: "> SYSTEM_CHECK: FAILED", delay: 500, type: "log-error" },
      { text: "> ATTEMPTING_RESTORE...", delay: 1200, type: "" },
      { text: "> SECTOR_7G: UNSTABLE", delay: 2000, type: "log-error" },
      { text: "> REBOOT_INITIATED.", delay: 4800, type: "log-success" },
    ];

    terminalLogs.forEach((log) => {
      const id = setTimeout(() => {
        setLogs(prev => [...prev, log]);
      }, log.delay);
      timeouts.push(id); 
    });

    const progressTimer = setTimeout(() => {
      setProgressWidth('100%'); // FIX: Use state setter instead of document.getElementById
    }, 500);
    timeouts.push(progressTimer);

    const redirectTimer = setTimeout(() => {
      navigate('/');
    }, 5500);
    timeouts.push(redirectTimer);

    return () => {
      timeouts.forEach(id => clearTimeout(id));
    };
  }, [navigate]);

  return (
    <>
      <SEO title="404 - System Failure" description="Page not found." />
      <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', backgroundColor: '#050505' }}>
        <div className="vignette"></div>
        <div className="content-wrapper">
          <h1 className="glitch" data-text="SYSTEM FAILURE">SYSTEM FAILURE</h1>
          <div className="sub-glitch">ERROR 404 // DATA_CORRUPTED</div>

          <div className="terminal-container" id="console">
            {logs.map((log, index) => (
              <div key={index} className={`log-line ${log.type}`}>{log.text}</div>
            ))}
          </div>

          <div className="progress-bar">
            {/* FIX: Bind style to React state */}
            <div className="progress-fill" style={{ width: progressWidth, transition: 'width 5s ease-in-out' }}></div>
          </div>

          <Link to="/" className="manual-btn mouse-hover">[ MANUAL_OVERRIDE ]</Link>
        </div>
      </div>
    </>
  );
}