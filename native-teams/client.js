window.__ModuleLoader__.load({
	id: "@marwa-mrwan/agency-team-native",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let react_dom = require("react-dom");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region \0dsh-css:packages/experimental/client-ui-agent-team/src/client/TeamAction.module.css.mjs
		const css = ".lTNeVq_root{position:relative}.lTNeVq_trigger{min-height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:0;border-radius:6px;align-items:center;gap:5px;padding:3px 7px;font-size:12px;display:inline-flex}.lTNeVq_trigger:focus-visible{color:var(--dsw-alias-label-primary)}@media (hover:hover){.lTNeVq_trigger:hover{color:var(--dsw-alias-label-primary)}}@container (width<=480px){.lTNeVq_triggerLabel{display:none}}.lTNeVq_count{color:var(--dsw-alias-label-caption);font-variant-numeric:tabular-nums;font-size:12px;font-weight:400;line-height:16px}.lTNeVq_panel{--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2);z-index:100;box-sizing:border-box;width:min(500px,100vw - 32px);max-height:min(680px, calc(100vh - 32px), var(--dsh-anchored-max-height,100vh));--dsw-elevation-stroke-color:var(--dsw-alias-border-l1);box-shadow:var(--dsw-elevation-prominent);max-width:var(--dsh-anchored-max-width,none);border:0;border-radius:12px;flex-direction:column;padding:8px 2px 0;display:flex;position:fixed;overflow:hidden}.lTNeVq_panel:before{content:\"\";z-index:-1;background:var(--dsw-specific-menu);backdrop-filter:var(--dsw-menu-backdrop-filter);border-radius:12px;position:absolute;inset:0}.lTNeVq_panelCompact{width:min(320px,100vw - 32px)}.lTNeVq_panelCompact .lTNeVq_roster{grid-template-columns:minmax(0,1fr)}.lTNeVq_body{--dsh-scrollbar-track-margin:8px;scrollbar-gutter:stable;flex:auto;min-height:0;padding:0 9px 16px 14px;overflow-y:auto}.lTNeVq_taskTitle{align-items:center;gap:8px;display:flex}.lTNeVq_taskTitle strong{font-size:13px;font-weight:500}.lTNeVq_panel h3{color:var(--dsw-alias-label-primary);align-items:center;gap:8px;margin:16px 0 8px 4px;font-size:13px;font-weight:500;display:flex}.lTNeVq_body section:first-of-type h3{margin-top:8px}.lTNeVq_roster{grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;display:grid}.lTNeVq_member{--dsw-elevation-stroke-color:var(--dsw-alias-border-l2);min-width:0;box-shadow:var(--dsw-elevation-stroke);background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-primary);text-align:left;cursor:pointer;border:0;border-radius:8px;align-items:flex-start;gap:8px;padding:10px 12px;display:flex}.lTNeVq_member:disabled{cursor:default}.lTNeVq_memberCurrent{--dsw-elevation-stroke-color:color-mix(in srgb, var(--dsw-alias-state-business-primary) 40%, transparent);box-shadow:var(--dsw-elevation-stroke), inset 0 0 0 1px color-mix(in srgb, var(--dsw-alias-state-business-primary) 40%, transparent)}.lTNeVq_member:not(:disabled):focus-visible{--dsw-elevation-stroke-color:var(--dsw-alias-border-l3);box-shadow:var(--dsw-elevation-panel)}@media (hover:hover){.lTNeVq_member:not(:disabled):hover{--dsw-elevation-stroke-color:var(--dsw-alias-border-l3);box-shadow:var(--dsw-elevation-panel)}}.lTNeVq_memberDot{flex:none;align-items:center;height:1lh;display:inline-flex}.lTNeVq_inactiveIcon{color:var(--dsw-alias-label-tertiary)}.lTNeVq_memberText{flex-direction:column;min-width:0;display:flex}.lTNeVq_memberName{align-items:center;gap:5px;min-width:0;display:inline-flex}.lTNeVq_memberNameText,.lTNeVq_memberText small{white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.lTNeVq_memberModel{display:none}.lTNeVq_member:focus-visible .lTNeVq_memberModel{display:inline}@media (hover:hover){.lTNeVq_member:hover .lTNeVq_memberModel{display:inline}}.lTNeVq_currentTag{text-overflow:ellipsis;flex:0 999 auto;min-width:0;padding:0 4px;font-size:10px;line-height:15px;display:inline-block;overflow:hidden}.lTNeVq_memberText small,.lTNeVq_meta{color:var(--dsw-alias-label-tertiary);font-size:11px}.lTNeVq_diagnostic,.lTNeVq_error,.lTNeVq_warning{color:var(--dsw-alias-state-error-primary)}.lTNeVq_tasks{flex-direction:column;gap:7px;display:flex}.lTNeVq_emptyNotice{color:var(--dsw-alias-label-tertiary);margin:16px 0 0 4px;font-size:12px}.lTNeVq_task{border:.5px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-2);border-radius:9px;padding:11px 13px}.lTNeVq_taskState{color:var(--dsw-alias-label-tertiary);align-items:center;gap:6px;margin-left:auto;font-size:11px;display:inline-flex}.lTNeVq_task p{color:var(--dsw-alias-label-secondary);white-space:pre-wrap;margin:5px 0;font-size:12px;line-height:18px}.lTNeVq_clampedDescription{-webkit-line-clamp:2;-webkit-box-orient:vertical;display:-webkit-box;overflow:hidden}.lTNeVq_expandToggle{float:right;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:0;align-items:center;gap:2px;margin-left:10px;padding:0;font-size:11px;line-height:20px;display:inline-flex}.lTNeVq_expandToggle:focus-visible{color:var(--dsw-alias-label-primary)}@media (hover:hover){.lTNeVq_expandToggle:hover{color:var(--dsw-alias-label-primary)}}.lTNeVq_expandToggle svg{transition:transform .12s}.lTNeVq_expandToggleOpen{transform:rotate(180deg)}.lTNeVq_meta{line-height:20px}.lTNeVq_meta>span{margin-right:10px}.lTNeVq_notice,.lTNeVq_error{align-items:center;gap:6px;padding:9px;font-size:12px;display:flex}@media (hover:none){.lTNeVq_memberModel{display:inline}}";
		const tagId = "@marwa-mrwan/agency-team-native/TeamAction.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@marwa-mrwan/agency-team-native";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var TeamAction_module_css_default = {
			"body": "lTNeVq_body",
			"clampedDescription": "lTNeVq_clampedDescription",
			"count": "lTNeVq_count",
			"currentTag": "lTNeVq_currentTag",
			"diagnostic": "lTNeVq_diagnostic",
			"emptyNotice": "lTNeVq_emptyNotice",
			"error": "lTNeVq_error",
			"expandToggle": "lTNeVq_expandToggle",
			"expandToggleOpen": "lTNeVq_expandToggleOpen",
			"inactiveIcon": "lTNeVq_inactiveIcon",
			"member": "lTNeVq_member",
			"memberCurrent": "lTNeVq_memberCurrent",
			"memberDot": "lTNeVq_memberDot",
			"memberModel": "lTNeVq_memberModel",
			"memberName": "lTNeVq_memberName",
			"memberNameText": "lTNeVq_memberNameText",
			"memberText": "lTNeVq_memberText",
			"meta": "lTNeVq_meta",
			"notice": "lTNeVq_notice",
			"panel": "lTNeVq_panel",
			"panelCompact": "lTNeVq_panelCompact",
			"root": "lTNeVq_root",
			"roster": "lTNeVq_roster",
			"task": "lTNeVq_task",
			"taskState": "lTNeVq_taskState",
			"taskTitle": "lTNeVq_taskTitle",
			"tasks": "lTNeVq_tasks",
			"trigger": "lTNeVq_trigger",
			"triggerLabel": "lTNeVq_triggerLabel",
			"warning": "lTNeVq_warning"
		};
		//#endregion
		//#region lib/types/client/TeamAction.js
		function statusKey(status) {
			switch (status) {
				case "pending": return "status.pending";
				case "in_progress": return "status.in_progress";
				case "completed": return "status.completed";
				/* v8 ignore next -- Team views omit deleted task tombstones. */
				case "deleted": return "status.completed";
			}
		}
		function memberStatusKey(status) {
			switch (status) {
				case "running": return "memberStatus.running";
				case "inactive": return "memberStatus.inactive";
				case "provisioning": return "memberStatus.provisioning";
				case "failed": return "memberStatus.failed";
			}
		}
		function memberDotState(status) {
			switch (status) {
				case "running":
				case "provisioning": return "ongoing";
				case "failed": return "error";
			}
		}
		function taskDotState(task) {
			switch (task.status) {
				case "pending": return task.ready ? "idle" : "warning";
				case "in_progress": return "ongoing";
				case "completed": return "done";
				/* v8 ignore next -- Team views omit deleted task tombstones. */
				case "deleted": return "idle";
			}
		}
		function TeamMemberRow({ member, memberCount, sessionId, useSessions, useSessionStatus, openTeammate, onError, t }) {
			const model = useSessions((state) => state.projectionsBySession[member.id]?.values.modelSelection?.next?.model);
			const running = useSessionStatus((state) => state.get(member.id)?.running);
			const summaryRunning = useSessions((state) => state.byId[member.id]?.running);
			const status = member.phase === "active" ? (running ?? summaryRunning) === true ? "running" : "inactive" : member.phase;
			const isCurrent = member.id === sessionId;
			const highlightCurrent = isCurrent && memberCount > 1;
			const inert = isCurrent || status === "failed" || status === "provisioning";
			return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
				label: t("open"),
				side: "bottom",
				gap: 4,
				disabled: inert,
				children: (0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					className: highlightCurrent ? `${TeamAction_module_css_default.member} ${TeamAction_module_css_default.memberCurrent}` : TeamAction_module_css_default.member,
					disabled: inert,
					onClick: () => {
						try {
							openTeammate(sessionId, member.id);
						} catch (reason) {
							onError(String(reason));
						}
					},
					children: [(0, react_jsx_runtime.jsx)("span", {
						className: TeamAction_module_css_default.memberDot,
						children: status === "inactive" ? (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconUserOutlineRegular, {
							size: 14,
							className: TeamAction_module_css_default.inactiveIcon
						}) : (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: memberDotState(status) })
					}), (0, react_jsx_runtime.jsxs)("span", {
						className: TeamAction_module_css_default.memberText,
						children: [
							(0, react_jsx_runtime.jsxs)("span", {
								className: TeamAction_module_css_default.memberName,
								children: [(0, react_jsx_runtime.jsx)("span", {
									className: TeamAction_module_css_default.memberNameText,
									children: member.name
								}), isCurrent && (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tag, {
									tone: "info",
									className: TeamAction_module_css_default.currentTag,
									children: t("current")
								})]
							}),
							(0, react_jsx_runtime.jsxs)("small", { children: [t(memberStatusKey(status)), model !== void 0 && (0, react_jsx_runtime.jsx)("span", {
								className: TeamAction_module_css_default.memberModel,
								children: ` · ${t("model")}: ${model}`
							})] }),
							member.error !== void 0 && (0, react_jsx_runtime.jsx)("small", {
								className: TeamAction_module_css_default.diagnostic,
								children: member.error
							})
						]
					})]
				})
			});
		}
		/** Task card with a two-line description clamp expanded from a toggle in the meta row. */
		function TaskCard({ task, t }) {
			const [expanded, setExpanded] = (0, react.useState)(false);
			const [clamped, setClamped] = (0, react.useState)(false);
			const textRef = (0, react.useRef)(null);
			(0, react.useLayoutEffect)(() => {
				if (expanded) return;
				const paragraph = textRef.current;
				/* v8 ignore next -- the paragraph mounts in the same commit as the effect. */
				if (paragraph === null) return;
				const measure = () => {
					setClamped(paragraph.scrollHeight > paragraph.clientHeight + 1);
				};
				measure();
				if (typeof ResizeObserver === "undefined") return;
				const observer = new ResizeObserver(measure);
				observer.observe(paragraph);
				return () => {
					observer.disconnect();
				};
			}, [task.description, expanded]);
			return (0, react_jsx_runtime.jsxs)("article", {
				className: TeamAction_module_css_default.task,
				children: [
					(0, react_jsx_runtime.jsxs)("div", {
						className: TeamAction_module_css_default.taskTitle,
						children: [(0, react_jsx_runtime.jsx)("strong", { children: task.subject }), (0, react_jsx_runtime.jsxs)("span", {
							className: TeamAction_module_css_default.taskState,
							children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: taskDotState(task) }), (0, react_jsx_runtime.jsx)("span", { children: t(statusKey(task.status)) })]
						})]
					}),
					(0, react_jsx_runtime.jsx)("p", {
						ref: textRef,
						className: expanded ? void 0 : TeamAction_module_css_default.clampedDescription,
						children: task.description
					}),
					(0, react_jsx_runtime.jsxs)("div", {
						className: TeamAction_module_css_default.meta,
						children: [
							(clamped || expanded) && (0, react_jsx_runtime.jsxs)("button", {
								type: "button",
								className: TeamAction_module_css_default.expandToggle,
								"aria-expanded": expanded,
								onClick: () => {
									setExpanded((current) => !current);
								},
								children: [t(expanded ? "task.collapse" : "task.expand"), (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconChevronDownOutlineRegular, {
									size: 12,
									className: expanded ? TeamAction_module_css_default.expandToggleOpen : void 0
								})]
							}),
							(0, react_jsx_runtime.jsx)("span", { children: task.id }),
							(0, react_jsx_runtime.jsxs)("span", { children: [
								t("owner"),
								": ",
								task.ownerName ?? t("unowned")
							] }),
							task.status === "pending" && (0, react_jsx_runtime.jsx)("span", { children: task.ready ? t("ready") : t("blocked") }),
							task.blockedBy.length > 0 && (0, react_jsx_runtime.jsxs)("span", { children: [
								t("blockedBy"),
								": ",
								task.blockedBy.join(", ")
							] }),
							task.writeScopes.length > 0 && (0, react_jsx_runtime.jsxs)("span", { children: [
								t("writeScopes"),
								": ",
								task.writeScopes.join(", ")
							] }),
							task.writeScopeWarnings.map((warning) => (0, react_jsx_runtime.jsx)("span", {
								className: TeamAction_module_css_default.warning,
								children: warning
							}, warning))
						]
					})
				]
			});
		}
		/** Render the Team roster and read-only task board. */
		function TeamAction({ sessionId, useSession, useSessions, useSessionStatus, openTeammate, t }) {
			const [open, setOpen] = (0, react.useState)(false);
			const [error, setError] = (0, react.useState)(null);
			const rootRef = (0, react.useRef)(null);
			const triggerRef = (0, react.useRef)(null);
			const triggerLabelRef = (0, react.useRef)(null);
			const panelRef = (0, react.useRef)(null);
			const position = (0, _deepseek_ai_dsh_client_ui_primitives.useAnchoredPosition)({
				open,
				anchorRef: triggerRef,
				panelRef,
				gap: 5,
				margin: 16
			});
			const positioned = position !== null;
			const leadSessionId = useSession((snapshot) => snapshot.subagent?.address.parentSessionId) ?? sessionId;
			const team = useSessions((state) => state.projectionsBySession[leadSessionId]?.values.agentTeam);
			const opening = useSession((snapshot) => snapshot.openState === "loading");
			const listing = useSessions((state) => state.phase === "pending");
			const hoverTimer = (0, react.useRef)(void 0);
			const pinnedRef = (0, react.useRef)(false);
			const cancelHoverChange = () => {
				clearTimeout(hoverTimer.current);
				hoverTimer.current = void 0;
			};
			(0, react.useEffect)(() => {
				cancelHoverChange();
				pinnedRef.current = false;
				setOpen(false);
				setError(null);
			}, [sessionId]);
			(0, react.useEffect)(() => cancelHoverChange, []);
			(0, react.useLayoutEffect)(() => {
				if (open && positioned && pinnedRef.current) panelRef.current?.focus();
			}, [open, positioned]);
			const changeOpen = (next) => {
				cancelHoverChange();
				if (!next) pinnedRef.current = false;
				setOpen(next);
			};
			const scheduleHoverOpen = () => {
				cancelHoverChange();
				if (open) return;
				const label = triggerLabelRef.current;
				/* v8 ignore next -- the label mounts with the trigger that received the hover. */
				if (label === null) return;
				if (getComputedStyle(label).display === "none") return;
				hoverTimer.current = setTimeout(() => {
					hoverTimer.current = void 0;
					changeOpen(true);
				}, 150);
			};
			const scheduleHoverClose = () => {
				cancelHoverChange();
				if (pinnedRef.current) return;
				hoverTimer.current = setTimeout(() => {
					hoverTimer.current = void 0;
					changeOpen(false);
				}, 120);
			};
			(0, _deepseek_ai_dsh_client_ui_primitives.useDismissOnOutsidePointer)(rootRef, open, changeOpen, panelRef);
			(0, react.useEffect)(() => {
				if (!open) return;
				const dismiss = (event) => {
					if (event.key !== "Escape") return;
					event.preventDefault();
					cancelHoverChange();
					pinnedRef.current = false;
					setOpen(false);
					if (panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus();
				};
				document.addEventListener("keydown", dismiss);
				return () => {
					document.removeEventListener("keydown", dismiss);
				};
			}, [open]);
			const compact = team !== void 0 && team.members.length === 1 && team.tasks.length === 0;
			return (0, react_jsx_runtime.jsxs)("div", {
				ref: rootRef,
				className: TeamAction_module_css_default.root,
				"data-team-action": true,
				onMouseLeave: scheduleHoverClose,
				children: [(0, react_jsx_runtime.jsxs)("button", {
					type: "button",
					ref: triggerRef,
					onMouseEnter: scheduleHoverOpen,
					className: TeamAction_module_css_default.trigger,
					"aria-label": t("trigger"),
					"aria-haspopup": "dialog",
					"aria-expanded": open,
					onClick: () => {
						cancelHoverChange();
						pinnedRef.current = true;
						if (!open) changeOpen(true);
						else panelRef.current?.focus();
					},
					children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.IconUsersOutlineRegular, { size: 14 }), (0, react_jsx_runtime.jsx)("span", {
						ref: triggerLabelRef,
						className: TeamAction_module_css_default.triggerLabel,
						children: t("trigger")
					})]
				}), open && (0, react_dom.createPortal)((0, react_jsx_runtime.jsx)("div", {
					ref: panelRef,
					className: compact ? `${TeamAction_module_css_default.panel} ${TeamAction_module_css_default.panelCompact}` : TeamAction_module_css_default.panel,
					style: position ?? {
						visibility: "hidden",
						left: 0,
						top: 0
					},
					role: "dialog",
					tabIndex: -1,
					"aria-label": t("trigger"),
					"data-team-panel": true,
					onMouseEnter: cancelHoverChange,
					onMouseLeave: scheduleHoverClose,
					children: (0, react_jsx_runtime.jsxs)("div", {
						className: TeamAction_module_css_default.body,
						children: [
							error !== null && (0, react_jsx_runtime.jsxs)("div", {
								className: TeamAction_module_css_default.error,
								role: "alert",
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "error" }), error]
							}),
							team === void 0 && (0, react_jsx_runtime.jsxs)("div", {
								className: TeamAction_module_css_default.notice,
								role: "status",
								children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: opening || listing ? "ongoing" : "warning" }), t(opening || listing ? "loading" : "unavailable")]
							}),
							team !== void 0 && (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [
								team.failure !== void 0 && (0, react_jsx_runtime.jsxs)("div", {
									className: TeamAction_module_css_default.error,
									role: "alert",
									children: [(0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.StateDot, { state: "error" }), t("failure", { message: team.failure })]
								}),
								(0, react_jsx_runtime.jsxs)("section", { children: [(0, react_jsx_runtime.jsxs)("h3", { children: [t("roster"), team.members.length > 1 && (0, react_jsx_runtime.jsx)("span", {
									className: TeamAction_module_css_default.count,
									children: team.members.length
								})] }), (0, react_jsx_runtime.jsx)("div", {
									className: TeamAction_module_css_default.roster,
									children: team.members.map((member) => (0, react_jsx_runtime.jsx)(TeamMemberRow, {
										member,
										memberCount: team.members.length,
										sessionId,
										useSessions,
										useSessionStatus,
										openTeammate,
										onError: setError,
										t
									}, member.id))
								})] }),
								(0, react_jsx_runtime.jsx)("section", { children: team.tasks.length === 0 ? (0, react_jsx_runtime.jsx)("p", {
									className: TeamAction_module_css_default.emptyNotice,
									children: t("empty")
								}) : (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [(0, react_jsx_runtime.jsxs)("h3", { children: [t("tasks"), (0, react_jsx_runtime.jsx)("span", {
									className: TeamAction_module_css_default.count,
									children: team.tasks.length
								})] }), (0, react_jsx_runtime.jsx)("div", {
									className: TeamAction_module_css_default.tasks,
									children: team.tasks.map((task) => (0, react_jsx_runtime.jsx)(TaskCard, {
										task,
										t
									}, task.id))
								})] }) })
							] })
						]
					})
				}), document.body)]
			});
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** Agent Teams Web dictionaries. */
		/** Locale namespace owned by the Agent Teams Web UI. */
		const NS = "agent-team";
		/** English dictionary and key source. */
		const en = {
			trigger: "Agent team",
			loading: "Loading team…",
			unavailable: "Team is unavailable",
			failure: "Invalid persisted team record: {message}",
			empty: "No shared tasks yet. Create them through the conversation.",
			roster: "Members",
			tasks: "Shared tasks",
			model: "Model",
			open: "Open member conversation",
			current: "Current chat",
			owner: "Owner",
			unowned: "Unowned",
			blockedBy: "Blocked by",
			writeScopes: "Write scopes",
			ready: "Ready",
			blocked: "Blocked by dependencies",
			"task.expand": "Show more",
			"task.collapse": "Show less",
			"memberStatus.running": "Running",
			"memberStatus.inactive": "Inactive",
			"memberStatus.provisioning": "Provisioning",
			"memberStatus.failed": "Failed",
			"status.pending": "Pending",
			"status.in_progress": "In progress",
			"status.completed": "Completed"
		};
		//#endregion
		//#region lib/types/client/mount.js
		/** Source-safe Agent Teams browser registration. */
		/** Required browser services for navigation, slots, and localized copy. */
		const inject = [
			"sessions",
			"uiWorkspace",
			"slots",
			"locale"
		];
		/**
		* Register the Team locale dictionaries and the conversation-header action.
		* The panel reads the Lead Session's `agentTeam` projection from the shared
		* Session store; this registration performs no Team RPC.
		* @param ctx - Client Context carrying the injected navigation, locale, slot, and Session services.
		*/
		function registerAgentTeamUi(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { en }), "client-ui-agent-team: dictionaries");
			const sessions = ctx.sessions;
			const leadSessionId = (sessionId) => {
				return (sessions.binding(sessionId)?.session.getSnapshot().subagent?.address)?.parentSessionId ?? sessionId;
			};
			const actions = { openTeammate(sessionId, childSessionId) {
				const parentSessionId = leadSessionId(sessionId);
				if ((sessions.retainInfo(sessionId).getSnapshot().retainedBy.mainView ?? 0) === 0) return;
				if (childSessionId === parentSessionId) {
					ctx.uiWorkspace.openSession(parentSessionId);
					return;
				}
				ctx.uiWorkspace.openSession({
					parentSessionId,
					childSessionId,
					mode: "continuable"
				});
			} };
			ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
				name: "conversation.session.header.actions",
				id: "agent-team",
				order: -20,
				locale: NS,
				inject: () => actions
			}, TeamAction));
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Browser entry registering the Agent Teams conversation-header action. */
		/**
		* Register the Team locale dictionaries and header action on the Client Context.
		* @param ctx - Client Context with the declared `inject` services available.
		*/
		function apply(ctx) {
			registerAgentTeamUi(ctx);
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

// Adapted module identity; see NOTICE.md.