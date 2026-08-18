import React, { useState } from 'react';
import styles from './Settings.module.css';

const CURRENT_VERSION = '1.0.0';
const GITHUB_REPO = 'roshannzth/tabspazio';
const GITHUB_URL = `https://github.com/${GITHUB_REPO}`;

type UpdateStatus = 'idle' | 'checking' | 'upToDate' | 'updateAvailable' | 'error';

function isNewerVersion(current: string, latest: string): boolean {
  const cleanCurrent = current.replace(/^v/i, '').trim();
  const cleanLatest = latest.replace(/^v/i, '').trim();

  const currentParts = cleanCurrent.split('.').map((n) => parseInt(n, 10) || 0);
  const latestParts = cleanLatest.split('.').map((n) => parseInt(n, 10) || 0);

  for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
    const cur = currentParts[i] || 0;
    const lat = latestParts[i] || 0;
    if (lat > cur) return true;
    if (lat < cur) return false;
  }
  return false;
}

export const AboutSettings: React.FC = () => {
  const [status, setStatus] = useState<UpdateStatus>('idle');
  const [latestVersion, setLatestVersion] = useState<string>('');
  const [releaseUrl, setReleaseUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const checkForUpdates = async () => {
    setStatus('checking');
    setErrorMessage('');

    try {
      // 1. Try fetching latest release from GitHub API
      const releaseRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (releaseRes.ok) {
        const data = await releaseRes.json();
        const tag = data.tag_name || data.name || '';
        const url = data.html_url || `${GITHUB_URL}/releases`;

        setLatestVersion(tag);
        setReleaseUrl(url);

        if (tag && isNewerVersion(CURRENT_VERSION, tag)) {
          setStatus('updateAvailable');
        } else {
          setStatus('upToDate');
        }
        return;
      }

      // 2. Fallback to tags endpoint if no releases are formally drafted
      const tagsRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/tags`, {
        headers: { Accept: 'application/vnd.github.v3+json' },
      });

      if (tagsRes.ok) {
        const tags = await tagsRes.json();
        if (Array.isArray(tags) && tags.length > 0) {
          const topTag = tags[0].name || '';
          setLatestVersion(topTag);
          setReleaseUrl(`${GITHUB_URL}/releases/tag/${topTag}`);

          if (topTag && isNewerVersion(CURRENT_VERSION, topTag)) {
            setStatus('updateAvailable');
            return;
          }
        }
        setStatus('upToDate');
        return;
      }

      // If GitHub returns 404 (repo private or no releases yet), treat current as up-to-date
      if (releaseRes.status === 404 || tagsRes.status === 404) {
        setStatus('upToDate');
        return;
      }

      throw new Error(`GitHub API returned status ${releaseRes.status}`);
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Failed to check GitHub releases.');
    }
  };

  return (
    <div className={styles.aboutContainer}>
      <h2 className={styles.sectionTitle}>About TabSpazio</h2>

      {/* Main App Info Card */}
      <div className={styles.aboutCard}>
        <div className={styles.aboutHeaderRow}>
          <div className={styles.aboutLogoCircle}>
            <img src="./icons/icon128.png" alt="TabSpazio Logo" className={styles.aboutLogoImg} />
          </div>
          <div>
            <h3 className={styles.aboutTitle}>TabSpazio</h3>
            <p className={styles.aboutVersion}>v{CURRENT_VERSION}</p>
          </div>
        </div>

        <p className={styles.aboutDesc}>
          A customizable, cinematic modern UI launcher replacement for your browser's New Tab page. Built with React 18, TypeScript, Vite, and CSS Modules.
        </p>

        {/* Update Checker Box */}
        <div className={styles.updateCard}>
          <div className={styles.updateCardContent}>
            <div>
              <div className={styles.updateCardTitle}>Extension Updates</div>
              <div className={styles.updateCardSub}>
                {status === 'idle' && `Current installed version is v${CURRENT_VERSION}.`}
                {status === 'checking' && 'Checking GitHub for the latest release...'}
                {status === 'upToDate' && `TabSpazio is up to date (v${CURRENT_VERSION}).`}
                {status === 'updateAvailable' && `Update available: ${latestVersion}!`}
                {status === 'error' && (errorMessage || 'Could not verify GitHub releases.')}
              </div>
            </div>

            <button
              type="button"
              className={styles.updateCheckBtn}
              onClick={checkForUpdates}
              disabled={status === 'checking'}
            >
              {status === 'checking' ? (
                <>
                  <span className={styles.spinner}>⏳</span> Checking...
                </>
              ) : (
                <>
                  <span>🔄</span> Check for Updates
                </>
              )}
            </button>
          </div>

          {/* Up to Date Banner */}
          {status === 'upToDate' && (
            <div className={styles.updateBannerSuccess}>
              <span className={styles.bannerIcon}>✓</span>
              <span>You're using the latest version of TabSpazio.</span>
            </div>
          )}

          {/* Update Available Banner */}
          {status === 'updateAvailable' && (
            <div className={styles.updateBannerAlert}>
              <div className={styles.updateAlertLeft}>
                <span className={styles.bannerIcon}>🚀</span>
                <div>
                  <strong>Version {latestVersion} is available!</strong>
                  <div className={styles.alertSub}>Download the latest package from GitHub.</div>
                </div>
              </div>
              <a
                href={releaseUrl || `${GITHUB_URL}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.downloadReleaseBtn}
              >
                View Release ↗
              </a>
            </div>
          )}

          {/* Error Banner */}
          {status === 'error' && (
            <div className={styles.updateBannerError}>
              <span>⚠️ Could not reach GitHub API.</span>
              <a
                href={`${GITHUB_URL}/releases`}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.errorLink}
              >
                Check Releases Manually ↗
              </a>
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className={styles.aboutLinksRow}>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.aboutLinkBtn}
          >
            <span>⭐</span> GitHub Repository
          </a>
          <a
            href={`${GITHUB_URL}/issues`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.aboutLinkBtn}
          >
            <span>🐛</span> Report an Issue
          </a>
          <a
            href={`${GITHUB_URL}/releases`}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.aboutLinkBtn}
          >
            <span>📜</span> Changelog & Releases
          </a>
        </div>
      </div>
    </div>
  );
};
