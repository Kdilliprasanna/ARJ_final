import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ActivityIndicator,
  Animated,
  Platform,
  NativeModules,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

// Network Host Configuration: Auto-detect LAN IP of host machine with fallback
const scriptURL = (NativeModules && NativeModules.SourceCode && NativeModules.SourceCode.scriptURL) || '';
const detectedHost = scriptURL.match(/^https?:\/\/([^:\/]+)/)?.[1];
const HOST_IP = detectedHost || '192.168.1.12';
const PRODUCTION_WEB_URL = 'https://kdilliprasanna.github.io/ARJ_final/';
const WEB_URL = `http://${HOST_IP}:5176`;
const API_URL = `http://${HOST_IP}:4000/api`;

// Injected CSS and JavaScript:
// 1. Mobile Phone Alignment Engine: Perfectly aligns all cards, forms, metrics, and navigation
// 2. Sleek Single-Row Floating Dock: Eliminates the clumsy 2-row wrapped navigation bar
// 3. Generous bottom clearance (130px): Prevents navigation from ever overlapping content
// 4. Transparently rewrites API calls to host LAN IP (port 4000)
// 5. Accurate network error differentiation
const INJECTED_BOOTSTRAP_JS = `
(function() {
  var HOST = '${HOST_IP}';
  var TARGET_API = 'http://' + HOST + ':4000';
  window.__ARJ_MOBILE_ENV__ = true;
  window.__BACKEND_IP__ = HOST;
  window.__BACKEND_PORT__ = '4000';
  window.__LAST_API_STATUS__ = 'ok';

  // 1. INJECT MOBILE PHONE ALIGNMENT STYLESHEET
  var styleId = 'arj-mobile-alignment-styles';
  if (!document.getElementById(styleId)) {
    var style = document.createElement('style');
    style.id = styleId;
    style.innerHTML = \`
      * {
        box-sizing: border-box !important;
        -webkit-tap-highlight-color: transparent !important;
      }

      html, body {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        background-color: #090d16 !important;
        -webkit-text-size-adjust: 100% !important;
      }

      #root {
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
        min-height: 100vh !important;
        background-color: #090d16 !important;
      }

      /* AUTH SCREEN: Clean, centered, structured layout for phones */
      .auth-screen {
        display: flex !important;
        flex-direction: column !important;
        min-height: 100vh !important;
        width: 100% !important;
        max-width: 100vw !important;
        padding: 1.5rem 1rem 2rem !important;
        justify-content: center !important;
        align-items: center !important;
        background: #090d16 !important;
        box-sizing: border-box !important;
      }

      .auth-visual {
        width: 100% !important;
        max-width: 440px !important;
        padding: 0.5rem 0.5rem 1rem !important;
        border: none !important;
        background: transparent !important;
        text-align: center !important;
        display: flex !important;
        flex-direction: column !important;
        align-items: center !important;
        gap: 0.5rem !important;
      }

      .auth-visual .brand-lockup {
        justify-content: center !important;
        font-size: 1.4rem !important;
        font-weight: 800 !important;
        color: #ffffff !important;
      }

      .auth-visual h1 {
        font-size: 1.05rem !important;
        font-weight: 600 !important;
        line-height: 1.4 !important;
        color: #94a3b8 !important;
        background: none !important;
        -webkit-text-fill-color: initial !important;
        margin: 0 auto !important;
        max-width: 340px !important;
        text-align: center !important;
      }

      /* Hide oversized desktop preview board on phone screens for focused UI */
      .auth-visual .preview-board {
        display: none !important;
      }

      /* Centered, structured Auth Card */
      .auth-panel {
        width: 100% !important;
        max-width: 440px !important;
        margin: 0 auto !important;
        padding: 1.75rem 1.25rem !important;
        border-radius: 20px !important;
        border: 1px solid rgba(255, 255, 255, 0.08) !important;
        background: rgba(15, 23, 42, 0.8) !important;
        backdrop-filter: blur(24px) !important;
        box-shadow: 0 16px 40px rgba(0, 0, 0, 0.55) !important;
        box-sizing: border-box !important;
      }

      .auth-tabs {
        display: grid !important;
        grid-template-columns: 1fr 1fr !important;
        gap: 8px !important;
        margin-bottom: 1.25rem !important;
        width: 100% !important;
      }

      .auth-tabs button {
        min-height: 44px !important;
        font-size: 0.92rem !important;
        border-radius: 10px !important;
        width: 100% !important;
        justify-content: center !important;
      }

      .auth-form {
        display: flex !important;
        flex-direction: column !important;
        gap: 1rem !important;
        width: 100% !important;
      }

      .auth-form label {
        display: flex !important;
        flex-direction: column !important;
        gap: 6px !important;
        width: 100% !important;
        font-size: 0.86rem !important;
      }

      .auth-form input {
        width: 100% !important;
        min-height: 48px !important;
        padding: 0 14px !important;
        border-radius: 10px !important;
        font-size: 0.95rem !important;
        box-sizing: border-box !important;
        background: rgba(11, 15, 25, 0.8) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        color: #f8fafc !important;
      }

      .auth-form button[type="submit"] {
        width: 100% !important;
        min-height: 48px !important;
        font-size: 0.98rem !important;
        font-weight: 700 !important;
        border-radius: 10px !important;
        margin-top: 0.5rem !important;
      }

      /* WORKSPACE & DASHBOARD PHONE ALIGNMENT */
      .app-shell {
        grid-template-columns: 1fr !important;
        width: 100% !important;
        max-width: 100vw !important;
        overflow-x: hidden !important;
      }

      .sidebar {
        display: none !important;
      }

      /* Generous bottom padding to prevent bottom navigation bar from overlapping content */
      .workspace {
        width: 100% !important;
        max-width: 100vw !important;
        padding: 10px 14px 130px !important;
        box-sizing: border-box !important;
        overflow-x: hidden !important;
      }

      .topbar {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        justify-content: space-between !important;
        padding: 10px 14px !important;
        gap: 8px !important;
        min-height: auto !important;
        border-bottom: 1px solid var(--line) !important;
      }

      .topbar h1 {
        font-size: 1.15rem !important;
        margin: 0 !important;
        line-height: 1.2 !important;
      }

      .topbar .eyebrow {
        font-size: 0.65rem !important;
        margin: 0 !important;
      }

      .topbar-right {
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        width: auto !important;
        flex-wrap: nowrap !important;
      }

      .topbar-right button {
        padding: 6px 12px !important;
        min-height: 34px !important;
        font-size: 0.78rem !important;
        white-space: nowrap !important;
      }

      /* All card grids strictly 1-column on phone width */
      .page-grid,
      .metric-grid,
      .template-grid,
      .filters,
      .history-list,
      .profile-form {
        display: grid !important;
        grid-template-columns: 1fr !important;
        width: 100% !important;
        gap: 12px !important;
        box-sizing: border-box !important;
      }

      .card, .panel, .metric-card {
        width: 100% !important;
        border-radius: 14px !important;
        padding: 14px !important;
        box-sizing: border-box !important;
      }

      /* Score Ribbon / Section Progress Ribbon Clean Vertical Stack on Phone */
      .span-12[style*="justify-content: space-between"] {
        display: flex !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 6px !important;
        padding: 10px 14px !important;
        box-sizing: border-box !important;
      }

      /* ULTRA-CLEAN SINGLE-ROW FLOATING NAVIGATION DOCK */
      /* Fixes clumsy 2-row wrap and ensures all 9 items distribute with mathematical symmetry */
      .mobile-nav {
        position: fixed !important;
        bottom: 12px !important;
        left: 8px !important;
        right: 8px !important;
        height: 54px !important;
        max-height: 54px !important;
        z-index: 9999 !important;
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        justify-content: space-around !important;
        gap: 2px !important;
        padding: 4px 6px !important;
        border-radius: 20px !important;
        background: rgba(11, 15, 25, 0.96) !important;
        backdrop-filter: blur(28px) !important;
        -webkit-backdrop-filter: blur(28px) !important;
        box-shadow: 0 10px 32px rgba(0, 0, 0, 0.85), 0 0 0 1px rgba(255, 255, 255, 0.12) !important;
        box-sizing: border-box !important;
        overflow-x: auto !important;
        overflow-y: hidden !important;
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
      }

      .mobile-nav::-webkit-scrollbar {
        display: none !important;
      }

      .mobile-nav button {
        flex: 1 1 0px !important;
        min-width: 32px !important;
        max-width: 44px !important;
        height: 42px !important;
        min-height: 42px !important;
        padding: 0 !important;
        display: inline-flex !important;
        align-items: center !important;
        justify-content: center !important;
        border-radius: 12px !important;
        border: 1px solid transparent !important;
        background: transparent !important;
        color: #94a3b8 !important;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
        box-shadow: none !important;
      }

      .mobile-nav button svg {
        width: 19px !important;
        height: 19px !important;
        stroke-width: 2 !important;
      }

      .mobile-nav button.active {
        background: linear-gradient(135deg, rgba(99, 102, 241, 0.35) 0%, rgba(139, 92, 246, 0.25) 100%) !important;
        border: 1px solid rgba(99, 102, 241, 0.75) !important;
        color: #ffffff !important;
        box-shadow: 0 0 14px rgba(99, 102, 241, 0.45) !important;
        transform: translateY(-2px) !important;
      }
    \`;
    document.head.appendChild(style);
  }

  // 2. URL rewrite helper: rewrites any :4000 backend URL to TARGET_API
  function rewriteUrl(u) {
    if (typeof u === 'string') {
      return u
        .replace(/https?:\\/\\/[^/]+:4000/gi, TARGET_API)
        .replace(/^\\/api\\//i, TARGET_API + '/api/');
    }
    return u;
  }

  // 3. Intercept window.fetch
  if (window.fetch) {
    var rawFetch = window.fetch;
    var patchedFetch = function(resource, init) {
      var target = resource;
      if (typeof resource === 'string') {
        target = rewriteUrl(resource);
      } else if (resource && resource.url) {
        try {
          var rew = rewriteUrl(resource.url);
          target = new Request(rew, resource);
        } catch (e) {
          target = resource;
        }
      }

      return rawFetch.call(this, target, init)
        .then(function(res) {
          window.__LAST_API_STATUS__ = res.status;
          return res;
        })
        .catch(function(err) {
          window.__LAST_API_STATUS__ = 'network_error';
          var netMsg = 'Cannot connect to ARJ Server (' + HOST + ':4000). Ensure phone and PC are on the same Wi-Fi.';
          if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              type: 'BACKEND_NETWORK_ERROR',
              message: netMsg
            }));
          }
          throw err;
        });
    };

    window.fetch = patchedFetch;
    if (typeof globalThis !== 'undefined') globalThis.fetch = patchedFetch;
    if (typeof self !== 'undefined') self.fetch = patchedFetch;
  }

  // 4. Intercept XMLHttpRequest
  if (window.XMLHttpRequest) {
    var rawOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
      var args = Array.prototype.slice.call(arguments);
      if (typeof url === 'string') {
        args[1] = rewriteUrl(url);
      }
      return rawOpen.apply(this, args);
    };
  }

  // 5. Accurate Network Error Handling
  var misleadingPhrase = "You don't have an account with this email";
  var networkErrorMessage = "Cannot connect to ARJ Server (" + HOST + ":4000). Ensure phone and PC are on the same Wi-Fi.";

  var observer = new MutationObserver(function(mutations) {
    if (window.__LAST_API_STATUS__ === 'network_error') {
      var allElements = document.querySelectorAll('*');
      for (var i = 0; i < allElements.length; i++) {
        var el = allElements[i];
        if (el.children.length === 0 && el.textContent && el.textContent.indexOf(misleadingPhrase) !== -1) {
          el.textContent = el.textContent.replace(new RegExp(misleadingPhrase + ".*", "g"), networkErrorMessage);
        }
      }
    }
  });

  if (document.body) {
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.body) {
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
      }
    });
  }

  // 6. Ensure responsive mobile viewport
  var meta = document.querySelector('meta[name="viewport"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'viewport';
    document.head.appendChild(meta);
  }
  meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes, viewport-fit=cover';
})();
true;
`;

function App() {
  const webViewRef = useRef(null);
  const [currentUrl, setCurrentUrl] = useState(WEB_URL);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [backendError, setBackendError] = useState('');
  const bannerAnim = useRef(new Animated.Value(0)).current;

  // Handle messages from the WebView
  const handleMessage = useCallback((event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data && data.type === 'BACKEND_NETWORK_ERROR') {
        setBackendError(data.message || `Cannot connect to ARJ Server (${HOST_IP}:4000). Ensure phone and PC are on the same Wi-Fi.`);
      }
    } catch (e) {
      // Non-JSON message
    }
  }, []);

  const handleRetry = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setErrorMessage('');
    setBackendError('');
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  }, []);

  const handleSwitchToCloud = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setErrorMessage('');
    setBackendError('');
    setCurrentUrl(PRODUCTION_WEB_URL);
  }, []);

  const handleSwitchToLocal = useCallback(() => {
    setHasError(false);
    setIsLoading(true);
    setErrorMessage('');
    setBackendError('');
    setCurrentUrl(WEB_URL);
  }, []);

  useEffect(() => {
    Animated.timing(bannerAnim, {
      toValue: (hasError || !!backendError) ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [hasError, backendError, bannerAnim]);

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top', 'bottom', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#090d16" translucent={false} />

      {/* Backend Communication Failure / Offline Banner */}
      {(hasError || !!backendError) && (
        <Animated.View
          style={[
            styles.offlineBanner,
            {
              opacity: bannerAnim,
              transform: [
                {
                  translateY: bannerAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-30, 0],
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.offlineDot} />
          <Text style={styles.offlineText} numberOfLines={2}>
            {backendError || `Cannot connect to ARJ Server (${HOST_IP}:4000). Ensure phone and PC are on the same Wi-Fi.`}
          </Text>
          {backendError ? (
            <TouchableOpacity onPress={() => setBackendError('')} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Text style={styles.dismissText}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </Animated.View>
      )}

      {/* Main Application Shell: Direct Edge-to-Edge WebView */}
      <View style={styles.contentContainer}>
        {hasError ? (
          /* Graceful Native Fallback Screen */
          <View style={styles.fallbackContainer}>
            <View style={styles.fallbackCard}>
              <View style={styles.logoBadge}>
                <Text style={styles.logoText}>ARJ</Text>
              </View>

              <Text style={styles.fallbackTitle}>Connection Fallback</Text>
              <Text style={styles.fallbackSubtitle}>
                Unable to reach ARJ Career AI web server.
              </Text>

              <View style={styles.infoBox}>
                <Text style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Web Shell: </Text>
                  <Text style={styles.infoValue}>{currentUrl}</Text>
                </Text>
                <Text style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Backend API: </Text>
                  <Text style={styles.infoValue}>{API_URL}</Text>
                </Text>
                <Text style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Database: </Text>
                  <Text style={styles.infoValue}>MongoDB Atlas (arj_career_ai)</Text>
                </Text>
                {errorMessage ? (
                  <Text style={styles.errorDetail}>Detail: {errorMessage}</Text>
                ) : null}
              </View>

              <Text style={styles.instructionsText}>
                Please verify your mobile device is connected to the same Wi-Fi network as the host computer ({HOST_IP}).
              </Text>

              <TouchableOpacity style={styles.retryButton} onPress={handleRetry} activeOpacity={0.8}>
                <Text style={styles.retryButtonText}>Retry Local Server ({HOST_IP}) 🔄</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.retryButton, styles.cloudButton]}
                onPress={handleSwitchToCloud}
                activeOpacity={0.8}
              >
                <Text style={styles.cloudButtonText}>Switch to Cloud Web App 🌐</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          /* Full-Screen Hardware-Accelerated WebView with Native Pull-To-Refresh */
          <WebView
            ref={webViewRef}
            source={{ uri: currentUrl }}
            style={styles.webView}
            // Unrestricted network & storage access
            javaScriptEnabled={true}
            domStorageEnabled={true}
            mixedContentMode="always"
            originWhitelist={['*']}
            allowUniversalAccessFromFileURLs={true}
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowsInlineMediaPlayback={true}
            mediaPlaybackRequiresUserAction={false}
            sharedCookiesEnabled={true}
            thirdPartyCookiesEnabled={true}
            cacheEnabled={true}
            androidHardwareAccelerationDisabled={false}
            androidLayerType="hardware"
            pullToRefreshEnabled={true}
            geolocationEnabled={true}
            setSupportMultipleWindows={false}
            bounces={true}
            injectedJavaScriptBeforeContentLoaded={INJECTED_BOOTSTRAP_JS}
            injectedJavaScript={INJECTED_BOOTSTRAP_JS}
            onMessage={handleMessage}
            onLoadStart={() => {
              setIsLoading(true);
              setHasError(false);
            }}
            onLoadEnd={() => {
              setIsLoading(false);
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              setHasError(true);
              setErrorMessage(nativeEvent.description || 'Network unreachable');
              setIsLoading(false);
            }}
            onHttpError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              if (nativeEvent.statusCode >= 400) {
                setHasError(true);
                setErrorMessage(`HTTP Error ${nativeEvent.statusCode}`);
                setIsLoading(false);
              }
            }}
          />
        )}

        {/* Native Top Loading Progress Bar */}
        {isLoading && !hasError && (
          <View style={styles.loadingOverlay} pointerEvents="none">
            <View style={styles.loadingPill}>
              <ActivityIndicator size="small" color="#6366f1" />
              <Text style={styles.loadingText}>Syncing ARJ Career AI...</Text>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Mobile App ErrorBoundary caught error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#090d16', justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <Text style={{ color: '#ef4444', fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>Application Encountered an Issue</Text>
          <Text style={{ color: '#94a3b8', fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 18 }}>
            {this.state.error?.message || 'Unexpected native rendering error'}
          </Text>
          <TouchableOpacity
            style={{ backgroundColor: '#6366f1', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 12 }}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 14 }}>Reload Application 🔄</Text>
          </TouchableOpacity>
        </SafeAreaView>
      );
    }
    return this.props.children;
  }
}

export default function SafeApp() {
  return (
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  );
}


const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  offlineBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#7f1d1d',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#ef4444',
  },
  offlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#f87171',
    marginRight: 8,
  },
  offlineText: {
    flex: 1,
    color: '#fee2e2',
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
  dismissText: {
    color: '#fee2e2',
    fontSize: 14,
    fontWeight: '800',
    marginLeft: 8,
    paddingHorizontal: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  webView: {
    flex: 1,
    backgroundColor: '#090d16',
  },
  loadingOverlay: {
    position: 'absolute',
    top: 12,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 999,
  },
  loadingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.94)',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.35)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  loadingText: {
    color: '#cbd5e1',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#090d16',
  },
  fallbackCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: 'rgba(17, 24, 39, 0.88)',
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 10,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#1e1b4b',
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  logoText: {
    color: '#818cf8',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 2,
  },
  fallbackTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
    marginBottom: 8,
    textAlign: 'center',
  },
  fallbackSubtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  infoBox: {
    width: '100%',
    backgroundColor: '#0c1322',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#1e293b',
  },
  infoRow: {
    fontSize: 12,
    color: '#cbd5e1',
    marginVertical: 3,
  },
  infoLabel: {
    fontWeight: '700',
    color: '#6366f1',
  },
  infoValue: {
    color: '#e2e8f0',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 11,
  },
  errorDetail: {
    fontSize: 11,
    color: '#f87171',
    marginTop: 6,
    fontStyle: 'italic',
  },
  instructionsText: {
    fontSize: 12,
    color: '#64748b',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 16,
  },
  retryButton: {
    width: '100%',
    backgroundColor: '#6366f1',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 4,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cloudButton: {
    backgroundColor: '#059669',
    marginTop: 12,
    shadowColor: '#059669',
  },
  cloudButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
