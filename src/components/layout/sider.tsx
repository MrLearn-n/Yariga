import React, { CSSProperties, useState } from "react";
import {
    CanAccess,
    ITreeMenu,
    useIsExistAuthentication,
    useLogout,
    useTitle,
    useTranslate,
    useRouterContext,
    useRouterType,
    useLink,
    useMenu,
    useRefineContext,
    useActiveAuthProvider,
    pickNotDeprecated,
    useWarnAboutChange,
} from "@refinedev/core";
import {
    ThemedTitleV2 as DefaultTitle,
    useThemedLayoutContext,
} from "@refinedev/mui";
import ChevronLeft from "@mui/icons-material/ChevronLeft";
import Dashboard from "@mui/icons-material/Dashboard";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListOutlined from "@mui/icons-material/ListOutlined";
import Logout from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import type { RefineThemedLayoutV2SiderProps } from "@refinedev/mui";
import { Logo } from "components/Logo/Logo";

export const ThemedSiderV2: React.FC<RefineThemedLayoutV2SiderProps> = ({
    Title: TitleFromProps,
    render,
    meta,
    activeItemDisabled = false,
}) => {
    const {
        siderCollapsed,
        setSiderCollapsed,
        mobileSiderOpen,
        setMobileSiderOpen,
    } = useThemedLayoutContext();

    const drawerWidth = () => {
        if (siderCollapsed) return 56;
        return 260;
    };

    const t = useTranslate();
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();
    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;
    const { hasDashboard } = useRefineContext();
    const translate = useTranslate();

    const { menuItems, selectedKey, defaultOpenKeys } = useMenu({ meta });
    const isExistAuthentication = useIsExistAuthentication();
    const TitleFromContext = useTitle();
    const authProvider = useActiveAuthProvider();
    const { warnWhen, setWarnWhen } = useWarnAboutChange();
    const { mutate: mutateLogout } = useLogout({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

    const [open, setOpen] = useState<{ [k: string]: any }>({});

    React.useEffect(() => {
        setOpen((previous) => {
            const previousKeys: string[] = Object.keys(previous);
            const previousOpenKeys = previousKeys.filter(
                (key) => previous[key]
            );

            const uniqueKeys = new Set([
                ...previousOpenKeys,
                ...defaultOpenKeys,
            ]);
            const uniqueKeysRecord = Object.fromEntries(
                Array.from(uniqueKeys.values()).map((key) => [key, true])
            );
            return uniqueKeysRecord;
        });
    }, [defaultOpenKeys]);



    const RenderToTitle = TitleFromProps ?? TitleFromContext ?? DefaultTitle;

    const handleClick = (key: string) => {
        setOpen({ ...open, [key]: !open[key] });
    };

    const renderTreeView = (tree: ITreeMenu[], selectedKey?: string) => {
        // console.log(tree);
        return tree.map((item: ITreeMenu) => {
            const {
                icon,
                label,
                route,
                name,
                children,
                parentName,
                meta,
                options,
            } = item;
            const isOpen = open[item.key || ""] || false;

            const isSelected = item.key === selectedKey;
            const isNested = !(
                pickNotDeprecated(meta?.parent, options?.parent, parentName) ===
                undefined
            );

            console.log(children);

            if (children.length > 0) {
                return (
                    <CanAccess
                        key={item.key}
                        resource={name.toLowerCase()}
                        action="list"
                        params={{
                            resource: item,
                        }}
                    >
                        <div key={item.key}>
                            <Tooltip
                                title={label ?? name}
                                placement="right"
                                disableHoverListener={!siderCollapsed}
                                arrow
                            >
                                <ListItemButton
                                    onClick={() => {
                                        if (siderCollapsed) {
                                            setSiderCollapsed(false);
                                            if (!isOpen) {
                                                handleClick(item.key || "");
                                            }
                                        } else {
                                            handleClick(item.key || "");
                                        }
                                    }}
                                    sx={{
                                        pl: isNested ? 4 : 2,
                                        justifyContent: "center",
                                        marginTop: "8px",
                                    }}
                                >
                                    <ListItemIcon
                                        sx={{
                                            justifyContent: "center",
                                            minWidth: "24px",
                                            transition: "margin-right 0.3s",
                                            marginRight: siderCollapsed
                                                ? "0px"
                                                : "12px",
                                            color: "currentColor",
                                        }}
                                    >
                                        {icon ?? <ListOutlined />}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={label}
                                        primaryTypographyProps={{
                                            noWrap: true,
                                            fontSize: "40px",
                                        }}
                                    />
                                    {isOpen ? (
                                        <ExpandLess
                                            sx={{
                                                color: "text.icon",
                                            }}
                                        />
                                    ) : (
                                        <ExpandMore
                                            sx={{
                                                color: "text.icon",
                                            }}
                                        />
                                    )}
                                </ListItemButton>
                            </Tooltip>
                            {!siderCollapsed && (
                                <Collapse
                                    in={open[item.key || ""]}
                                    timeout="auto"
                                    unmountOnExit
                                >
                                    <List component="div" disablePadding>
                                        {renderTreeView(children, selectedKey)}
                                    </List>
                                </Collapse>
                            )}
                        </div>
                    </CanAccess>
                );
            }

            const linkStyle: CSSProperties =
                activeItemDisabled && isSelected
                    ? { pointerEvents: "none", accentColor: "red" }
                    : {};

            return (
                <CanAccess
                    key={item.key}
                    resource={name.toLowerCase()}
                    action="list"
                    params={{ resource: item }}
                >
                    <Tooltip
                        title={label ?? name}
                        placement="right"
                        disableHoverListener={!siderCollapsed}
                        arrow
                    >
                        <ListItemButton
                            component={ActiveLink}
                            to={route}
                            selected={isSelected}
                            style={linkStyle}
                            onClick={() => {
                                setMobileSiderOpen(false);
                            }}
                            sx={{
                                pl: isNested ? 4 : 2,
                                py: isNested ? 1.25 : 1,
                                justifyContent: "center",
                                margin: '10px 16px',
                                padding: '16px 23px',
                                borderRadius: '10px',
                                "&.Mui-selected": {
                                  "&:hover": {
                                    backgroundColor: isSelected ? '#1e36e8' : 'transparent'
                                  },
                                  backgroundColor: isSelected ? '#475be8' : 'transparent'
                                }
                            }}
                        >
                            <ListItemIcon
                                sx={{
                                    justifyContent: "center",
                                    transition: "margin-right 0.3s",
                                    marginRight: siderCollapsed
                                        ? "0px"
                                        : "12px",
                                    minWidth: "24px",
                                    color: "#808191",
                                }}
                            >
                                {icon ?? <ListOutlined />}
                            </ListItemIcon>
                            <ListItemText
                                primary={label}
                                primaryTypographyProps={{
                                    noWrap: true,
                                    fontWeight: 700,
                                    fontSize: "16px",
                                    color: isSelected ? "#fff" : "#808191",
                                }}
                            />
                        </ListItemButton>
                    </Tooltip>
                </CanAccess>
            );
        });
    };

    const dashboard = hasDashboard ? (
        <CanAccess resource="dashboard" action="list">
            <Tooltip
                title={translate("dashboard.title", "Dashboard")}
                placement="right"
                disableHoverListener={!siderCollapsed}
                arrow
            >
                <ListItemButton
                    component={ActiveLink}
                    to="/"
                    selected={selectedKey === "/"}
                    onClick={() => {
                        setMobileSiderOpen(false);
                    }}
                    sx={{
                        pl: 2,
                        py: 1,
                        justifyContent: "center",
                        color:
                            selectedKey === "/"
                                ? "primary.main"
                                : "text.primary",
                    }}
                >
                    <ListItemIcon
                        sx={{
                            justifyContent: "center",
                            minWidth: "24px",
                            transition: "margin-right 0.3s",
                            marginRight: siderCollapsed ? "0px" : "12px",
                            color: "currentColor",
                            fontSize: "14px",
                        }}
                    >
                        <Dashboard />
                    </ListItemIcon>
                    <ListItemText
                        primary={translate("dashboard.title", "Dashboard")}
                        primaryTypographyProps={{
                            noWrap: true,
                            fontSize: "14px",
                        }}
                    />
                </ListItemButton>
            </Tooltip>
        </CanAccess>
    ) : null;

    const handleLogout = () => {
        if (warnWhen) {
            const confirm = window.confirm(
                t(
                    "warnWhenUnsavedChanges",
                    "Are you sure you want to leave? You have unsaved changes."
                )
            );

            if (confirm) {
                setWarnWhen(false);
                mutateLogout();
            }
        } else {
            mutateLogout();
        }
    };

    const logout = isExistAuthentication && (
        <Tooltip
            title={t("buttons.logout", "Logout")}
            placement="right"
            disableHoverListener={!siderCollapsed}
            arrow
        >
            <ListItemButton
                key="logout"
                onClick={() => handleLogout()}
                sx={{
                    margin: '10px 16px',
                    padding: '16px 23px',
                    borderRadius: '10px',
                    justifyContent: "center",
                }}
            >
                <ListItemIcon
                    sx={{
                        justifyContent: "center",
                        minWidth: "24px",
                        transition: "margin-right 0.3s",
                        marginRight: siderCollapsed ? "0px" : "12px",
                        color: "#808191",
                    }}
                >
                    <Logout />
                </ListItemIcon>
                <ListItemText
                    primary={t("buttons.logout", "Logout")}
                    primaryTypographyProps={{
                        noWrap: true,
                        fontWeight: 700,
                        fontSize: "16px",
                        color: "red",
                    }}
                />
            </ListItemButton>
        </Tooltip>
    );

    const items = renderTreeView(menuItems, selectedKey);

    const renderSider = () => {
        if (render) {
            return render({
                dashboard,
                logout,
                items,
                collapsed: siderCollapsed,
            });
        }
        return (
            <>
                {dashboard}
                {items}
                {logout}
            </>
        );
    };

    const drawer = (
        <List
            disablePadding
            sx={{
                flexGrow: 1,
                paddingTop: "16px",
            }}
        >
            {renderSider()}
        </List>
    );

    return (
        <>
            <Box
                sx={{
                    width: { xs: drawerWidth() },
                    display: {
                        xs: "none",
                        md: "block",
                    },
                    transition: "width 0.3s ease",
                }}
            />
            <Box
                component="nav"
                sx={{
                    position: "fixed",
                    zIndex: 1101,
                    width: { sm: drawerWidth() },
                    display: "flex",
                    "&.MuiBox-root": {
                        bgcolor: "#FCFCFC",
                    } 
                }}
            >
                <Drawer
                    variant="temporary"
                    elevation={2}
                    open={mobileSiderOpen}
                    onClose={() => setMobileSiderOpen(false)}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: {
                            sm: "block",
                            md: "none",
                        },
                    }}
                >
                    <Box
                        sx={{
                            width: drawerWidth(),
                        }}
                    >
                        <Box
                            sx={{
                                height: 64,
                                display: "flex",
                                alignItems: "center",
                                paddingLeft: "16px",
                                fontSize: "14px",
                            }}
                        >
                            <Logo />
                        </Box>
                        {drawer}
                    </Box>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": {
                            bgcolor: "#FCFCFC",
                            width: drawerWidth(),
                            overflow: "hidden",
                            transition:
                                "width 200ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
                        },
                    }}
                    open
                >
                    <Paper
                        elevation={0}
                        sx={{
                            fontSize: "14px",
                            width: "100%",
                            bgcolor: "#FCFCFC",
                            height: 64,
                            display: "flex",
                            flexShrink: 0,
                            alignItems: "center",
                            justifyContent: siderCollapsed
                                ? "center"
                                : "space-between",
                            paddingLeft: siderCollapsed ? 0 : "16px",
                            paddingRight: siderCollapsed ? 0 : "8px",
                            variant: "outlined",
                            borderRadius: 0,
                            borderBottom: (theme) =>
                                `1px solid ${theme.palette.action.focus}`,
                        }}
                    >
                        {/* <RenderToTitle collapsed={siderCollapsed} /> */}
                        <Logo />
                        {!siderCollapsed && (
                            <IconButton
                                size="small"
                                onClick={() => setSiderCollapsed(true)}
                            >
                                {<ChevronLeft />}
                            </IconButton>
                        )}
                    </Paper>
                    <Box
                        sx={{
                            flexGrow: 1,
                            overflowX: "hidden",
                            overflowY: "auto",
                        }}
                    >
                        {drawer}
                    </Box>
                </Drawer>
            </Box>
        </>
    );
};
