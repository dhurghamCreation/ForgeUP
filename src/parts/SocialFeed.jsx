import { useState, useEffect } from "react";
import {
  ChevronLeft, Heart, Trophy, Users, Flame, Activity, Share2,
  Target, Check, Send, Lock, MessageCircle,
} from "lucide-react";
import { useLang } from "../i18n";

const C = {
  bg: "#F7F5F2",
  surface: "#FFFFFF",
  raised: "#F0EDE8",
  line: "#E2DDD5",
  hi: "#1F2937",
  mid: "#6B7280",
  low: "#9CA3AF",
  accent: "#0b1bf5",
  warm: "#eb0b0b",
  cool: "#098159",
  gold: "#a57b10",
};

const FONT_DISPLAY = "'Space Grotesk', 'Inter', sans-serif";
const FONT_BODY = "'Inter', sans-serif";
const FONT_MONO = "'JetBrains Mono', monospace";

export default function SocialFeed({ onBack, currentUser, onPostWorkout, onRequireAuth }) {
  const { t } = useLang();
  const [tab, setTab] = useState("feed"); // feed | challenges | leaderboard
  const [feed, setFeed] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [kudosGiven, setKudosGiven] = useState({});
  const [commentsOpen, setCommentsOpen] = useState({});
  const [commentText, setCommentText] = useState({});
  const [commentsByPost, setCommentsByPost] = useState({});
  const [firebaseReady, setFirebaseReady] = useState(false);
  const [error, setError] = useState("");

  // Load real data from Firebase — only real user data is shown, no fake posts
  useEffect(() => {
    let mounted = true;
    const unsubs = [];

    const loadSocial = async () => {
      try {
        const { isFirebaseConfigured, getFeed, getChallenges, getLeaderboard } = await import("../firebase");
        if (!isFirebaseConfigured) {
          if (mounted) {
            setError(t("firebaseNeeded"));
          }
          return;
        }
        if (mounted) setFirebaseReady(true);

        const unsubFeed = getFeed((posts) => {
          if (mounted && posts.length > 0) setFeed(posts);
        });
        unsubs.push(unsubFeed);

        const unsubChallenges = getChallenges((challenges) => {
          if (mounted && challenges.length > 0) setChallenges(challenges);
        });
        unsubs.push(unsubChallenges);

        const unsubLeaderboard = getLeaderboard((users) => {
          if (mounted && users.length > 0) {
            setLeaderboard(users.map((u) => ({
              username: u.username || u.profile?.username || u.email?.split("@")[0] || "User",
              weeklyVolume: u.weeklyVolume || 0,
              streak: u.streak || 0,
            })));
          }
        });
        unsubs.push(unsubLeaderboard);
      } catch (e) {
        if (mounted) {
          setError(t("socialUnavailable"));
        }
      }
    };

    loadSocial();
    return () => {
      mounted = false;
      unsubs.forEach((u) => u && u());
    };
  }, []);

  const handleKudos = async (postId) => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (!firebaseReady) {
      setError(t("connectivityLoading"));
      return;
    }
    const isGiving = !kudosGiven[postId];
    setKudosGiven((prev) => ({ ...prev, [postId]: isGiving }));
    setFeed((prev) => prev.map((p) =>
      p.id === postId
        ? { ...p, kudosCount: Math.max(0, (p.kudosCount || 0) + (isGiving ? 1 : -1)) }
        : p
    ));
    const { addKudos, removeKudos } = await import("../firebase");
    if (isGiving) {
      await addKudos(postId, currentUser.uid);
    } else {
      await removeKudos(postId, currentUser.uid);
    }
  };

  const handleJoinChallenge = async (challengeId) => {
    if (joinedChallenges.includes(challengeId)) return;
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (!firebaseReady) return;
    setJoinedChallenges((prev) => [...prev, challengeId]);
    setChallenges((prev) => prev.map((c) =>
      c.id === challengeId ? { ...c, participantCount: (c.participantCount || 0) + 1 } : c
    ));
    const { joinChallenge } = await import("../firebase");
    await joinChallenge(challengeId, currentUser.uid, currentUser.displayName || "You");
  };

  const toggleComments = async (postId) => {
    const nextOpen = !commentsOpen[postId];
    setCommentsOpen((prev) => ({ ...prev, [postId]: nextOpen }));
    if (nextOpen && !commentsByPost[postId] && firebaseReady) {
      const { getComments } = await import("../firebase");
      getComments(postId, (comments) => {
        setCommentsByPost((prev) => ({ ...prev, [postId]: comments }));
      });
    }
  };

  const submitComment = async (postId) => {
    const text = (commentText[postId] || "").trim();
    if (!text || !currentUser || !firebaseReady) return;
    const { addComment } = await import("../firebase");
    const result = await addComment(postId, currentUser.uid, currentUser.displayName || currentUser.email?.split("@")[0] || "You", text);
    if (result.success) {
      setCommentText((prev) => ({ ...prev, [postId]: "" }));
    }
  };

  const handlePostWorkoutClick = () => {
    if (!currentUser) {
      if (onRequireAuth) onRequireAuth();
      return;
    }
    if (!firebaseReady) {
      setError(t("connectivityLoading"));
      return;
    }
    if (onPostWorkout) onPostWorkout();
  };

  const PostIcon = ({ type }) => {
    if (type === "pr") return <Trophy size={16} color={C.warm} />;
    if (type === "challenge") return <Target size={16} color={C.cool} />;
    return <Activity size={16} color={C.accent} />;
  };

  return (
    <div className="h-full flex flex-col" style={{ background: C.bg }}>
      <div className="px-5 pt-14 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} style={{ background: C.raised, border: `1px solid ${C.line}` }} className="rounded-full p-2 hover-pop">
            <ChevronLeft size={18} color={C.hi} />
          </button>
          <h1 style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 20, fontWeight: 700 }}>{t("community")}</h1>
        </div>
        {!currentUser && (
          <button onClick={onRequireAuth || onBack} style={{ fontFamily: FONT_BODY, color: C.accent, fontSize: 11, display: "flex", alignItems: "center", gap: 4 }} className="hover-pop">
            <Lock size={12} /> {t("signInToStart")}
          </button>
        )}
      </div>

      {/* Tab navigation */}
      <div className="px-5 flex gap-2 mb-4">
        {[
          { id: "feed", label: t("feed"), icon: Activity },
          { id: "challenges", label: t("challenges"), icon: Target },
          { id: "leaderboard", label: t("leaderboard"), icon: Trophy },
        ].map((tabItem) => (
          <button
            key={tabItem.id}
            onClick={() => setTab(tabItem.id)}
            style={{
              flex: 1,
              fontFamily: FONT_BODY, fontSize: 12, fontWeight: 600,
              padding: "8px 0", borderRadius: 10,
              background: tab === tabItem.id ? C.accent : C.raised,
              color: tab === tabItem.id ? C.bg : C.mid,
              border: tab === tabItem.id ? "none" : `1px solid ${C.line}`,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
            }}
            className="hover-pop"
          >
            <tabItem.icon size={13} />
            {tabItem.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-28 overflow-y-auto flex-1">
        {error && (
          <div style={{ background: `${C.gold}15`, border: `1px solid ${C.gold}40`, borderRadius: 12 }} className="p-3 mb-4">
            <div style={{ fontFamily: FONT_BODY, color: C.gold, fontSize: 11.5, lineHeight: 1.6 }}>{error}</div>
          </div>
        )}

        {/* FEED TAB */}
        {tab === "feed" && (
          <>
            {onPostWorkout && (
              <button
                onClick={handlePostWorkoutClick}
                style={{ background: `linear-gradient(135deg, ${C.accent}, ${C.cool})`, fontFamily: FONT_BODY, fontWeight: 700, color: C.bg }}
                className="w-full rounded-xl py-3 mb-4 flex items-center justify-center gap-2 text-sm hover-glow"
              >
                <Share2 size={15} /> {t("shareYourWorkout")}
              </button>
            )}

            {feed.length === 0 && !error && (
              <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-6 mb-4 text-center">
                <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }} className="mb-1">{t("noPostsYet")}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.6 }}>
                  {t("noPostsDesc")}
                </div>
              </div>
            )}

            {feed.map((post) => (
              <div key={post.id} style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ background: `${post.color || C.accent}22`, borderRadius: 10, width: 36, height: 36 }} className="flex items-center justify-center">
                    <PostIcon type={post.type} />
                  </div>
                  <div className="flex-1">
                    <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: 600 }}>{post.username}</div>
                    <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 10 }}>{post.time || t("justNow")}</div>
                  </div>
                </div>
                <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{post.title}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.mid, fontSize: 12 }} className="mt-1">{post.detail}</div>
                <div className="flex items-center gap-4 mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                  <button
                    onClick={() => handleKudos(post.id)}
                    style={{ fontFamily: FONT_BODY, fontSize: 12, color: kudosGiven[post.id] ? C.warm : C.mid, display: "flex", alignItems: "center", gap: 4 }}
                    className="hover-pop"
                  >
                    <Heart size={14} fill={kudosGiven[post.id] ? C.warm : "none"} color={kudosGiven[post.id] ? C.warm : C.mid} />
                    {post.kudosCount || 0} {t("kudos")}
                  </button>
                  <button
                    onClick={() => toggleComments(post.id)}
                    style={{ fontFamily: FONT_BODY, fontSize: 12, color: commentsOpen[post.id] ? C.accent : C.mid, display: "flex", alignItems: "center", gap: 4 }}
                    className="hover-pop"
                  >
                    <MessageCircle size={14} color={commentsOpen[post.id] ? C.accent : C.mid} />
                    {post.commentCount || 0} {t("comment")}
                  </button>
                </div>

                {/* Comments section */}
                {commentsOpen[post.id] && (
                  <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${C.line}` }}>
                    {/* Comment list */}
                    {(commentsByPost[post.id] || []).length === 0 && (
                      <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11, marginBottom: 8 }}>{t("noCommentsYet")}</div>
                    )}
                    {(commentsByPost[post.id] || []).map((comment) => (
                      <div key={comment.id} className="mb-2 flex items-start gap-2">
                        <div style={{ background: `${C.accent}22`, borderRadius: 8, width: 24, height: 24 }} className="flex items-center justify-center flex-shrink-0">
                          <span style={{ fontFamily: FONT_BODY, fontSize: 10, fontWeight: 700, color: C.accent }}>
                            {(comment.username || "?").charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div style={{ background: C.surface, border: `1px solid ${C.line}`, borderRadius: 10 }} className="px-3 py-2 flex-1">
                          <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 11, fontWeight: 600 }}>{comment.username}</div>
                          <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 12, marginTop: 1 }}>{comment.text}</div>
                        </div>
                      </div>
                    ))}

                    {/* Comment input */}
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        value={commentText[post.id] || ""}
                        onChange={(e) => setCommentText((prev) => ({ ...prev, [post.id]: e.target.value }))}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") submitComment(post.id);
                        }}
                        placeholder={currentUser ? t("writeComment") : t("signInToComment")}
                        disabled={!currentUser || !firebaseReady}
                        style={{
                          fontFamily: FONT_BODY, flex: 1, fontSize: 12,
                          backgroundColor: C.surface, border: `1px solid ${C.line}`,
                          borderRadius: 10, padding: "7px 10px", color: C.hi, outline: "none",
                        }}
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        disabled={!currentUser || !firebaseReady || !(commentText[post.id] || "").trim()}
                        style={{
                          background: currentUser && firebaseReady && (commentText[post.id] || "").trim() ? C.accent : C.line,
                          borderRadius: 10, padding: "7px 10px",
                        }}
                        className="hover-pop"
                      >
                        <Send size={14} color={currentUser && firebaseReady && (commentText[post.id] || "").trim() ? C.bg : C.low} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* CHALLENGES TAB */}
        {tab === "challenges" && (
          <>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
              {t("joinChallenges")}
            </div>
            {challenges.length === 0 && !error && (
              <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-6 text-center">
                <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{t("noActiveChallenges")}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.6, marginTop: 4 }}>
                  {t("noActiveChallengesDesc")}
                </div>
              </div>
            )}
            {challenges.map((ch) => {
              const joined = joinedChallenges.includes(ch.id);
              const pct = Math.min(100, ((ch.progress || 0) / (ch.days || 30)) * 100);
              return (
                <div key={ch.id} style={{ background: C.raised, border: `1px solid ${joined ? ch.color : C.line}`, borderRadius: 16 }} className="p-4 mb-3 hover-lift">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div style={{ background: `${ch.color || C.accent}22`, borderRadius: 10 }} className="p-2">
                        <Target size={18} color={ch.color || C.accent} />
                      </div>
                      <div>
                        <div style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13.5, fontWeight: 600 }}>{ch.name}</div>
                        <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 11 }} className="mt-0.5">{ch.desc}</div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users size={12} color={C.mid} />
                    <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 11 }}>{ch.participantCount || 0} {t("participants")}</span>
                  </div>
                  <div style={{ background: C.line, borderRadius: 999, height: 6 }} className="overflow-hidden mb-2">
                    <div style={{ background: ch.color || C.accent, width: `${pct}%`, height: "100%", borderRadius: 999, transition: "width 0.4s ease" }} />
                  </div>
                  <div className="flex items-center justify-between">
                    <span style={{ fontFamily: FONT_MONO, color: C.low, fontSize: 10 }}>{t("dayOf")} {ch.progress || 0} {t("of")} {ch.days || 30}</span>
                    <button
                      onClick={() => handleJoinChallenge(ch.id)}
                      disabled={joined || !currentUser || !firebaseReady}
                      style={{
                        background: joined ? C.cool : (ch.color || C.accent),
                        fontFamily: FONT_BODY, fontWeight: 700, color: C.bg, borderRadius: 8,
                        opacity: (joined || !currentUser || !firebaseReady) ? 0.7 : 1,
                      }}
                      className="px-3 py-1.5 text-xs hover-pop"
                    >
                      {joined ? <><Check size={12} /> {t("joined")}</> : t("joinChallenge")}
                    </button>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* LEADERBOARD TAB */}
        {tab === "leaderboard" && (
          <>
            <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.7 }} className="mb-4">
              {t("weeklyVolumeLeaderboard")}
            </div>
            {leaderboard.length === 0 && !error && (
              <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-6 text-center">
                <div style={{ fontFamily: FONT_DISPLAY, color: C.hi, fontSize: 14, fontWeight: 700 }}>{t("leaderboardEmpty")}</div>
                <div style={{ fontFamily: FONT_BODY, color: C.low, fontSize: 12, lineHeight: 1.6, marginTop: 2 }}>
                  {t("leaderboardEmptyDesc")}
                </div>
              </div>
            )}
            <div style={{ background: C.raised, border: `1px solid ${C.line}`, borderRadius: 16 }} className="p-4 mb-4">
              {leaderboard.map((user, i) => {
                const isYou = user.username === currentUser?.displayName || user.username === (currentUser?.profile?.username);
                return (
                  <div
                    key={i}
                    style={{
                      background: isYou ? "#FFF7E6" : "transparent",
                      border: isYou ? `1px solid ${C.gold}` : "none",
                      borderRadius: 10,
                    }}
                    className="flex items-center justify-between px-3 py-2.5 mb-1.5"
                  >
                    <div className="flex items-center gap-3">
                      <span style={{
                        fontFamily: FONT_MONO, fontSize: 12, fontWeight: 700,
                        color: i === 0 ? C.gold : i === 1 ? C.mid : i === 2 ? C.warm : C.low,
                        width: 20,
                      }}>
                        {i + 1}
                      </span>
                      <div className="flex items-center gap-2">
                        {i === 0 && <Trophy size={14} color={C.gold} />}
                        <span style={{ fontFamily: FONT_BODY, color: C.hi, fontSize: 13, fontWeight: isYou ? 700 : 500 }}>
                          {user.username}{isYou ? ` (${t("you")})` : ""}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <Flame size={12} color={C.warm} />
                        <span style={{ fontFamily: FONT_MONO, color: C.mid, fontSize: 11 }}>{user.streak}d</span>
                      </div>
                      <span style={{ fontFamily: FONT_MONO, color: C.accent, fontSize: 12, fontWeight: 700 }}>
                        {(user.weeklyVolume || 0).toFixed(1)}t
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}