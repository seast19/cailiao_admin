import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true
  },

  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: { title: "材料管理系统", icon: "dashboard" }
      }
    ]
  },
  // 用户管理
  {
    path: "/user",
    component: Layout,
    redirect: "/user/info",
    alwaysShow: true,
    name: "User",
    meta: { title: "用户管理", icon: "user", roles: ["admin"] },
    children: [
      {
        path: "info",
        name: "UserInfo",
        component: () => import("@/views/user/info.vue"),
        meta: { title: "用户信息", icon: "el-icon-user" }
      },
      {
        path: "add",
        hidden: true,
        name: "UserAdd",
        component: () => import("@/views/user/add.vue"),
        meta: { title: "添加用户" }
      },
      {
        path: "edit",
        hidden: true,
        name: "UserEdit",
        component: () => import("@/views/user/edit.vue"),
        meta: { title: "编辑用户" }
      }
    ]
  },
  // 材料信息管理
  {
    path: "/material",
    component: Layout,
    redirect: "/material/place/info",
    alwaysShow: true,
    name: "Material",
    meta: { title: "材料信息", icon: "el-icon-s-shop", roles: ["editor", "admin"] },
    children: [
      // 货架相关
      {
        path: "place/info",
        name: "PlaceInfo",
        component: () => import("@/views/place/placeinfo.vue"),
        meta: { title: "货架信息", icon: "el-icon-box" }
      },
      {
        path: "place/add",
        hidden: true,
        name: "PlaceAdd",
        component: () => import("@/views/place/placeadd.vue"),
        meta: { title: "添加货架" }
      },
      {
        path: "place/edit",
        hidden: true,
        name: "PlaceEdit",
        component: () => import("@/views/place/placeedit.vue"),
        meta: { title: "编辑货架" }
      },
      // 材料相关
      {
        path: "material/info",
        name: "MaterialInfo",
        component: () => import("@/views/material/info.vue"),
        meta: { title: "材料信息", icon: "el-icon-box" }
      },
      {
        path: "material/add",
        hidden: true,
        name: "MaterialAdd",
        component: () => import("@/views/material/add.vue"),
        meta: { title: "添加材料" }
      },
      {
        path: "material/edit",
        hidden: true,
        name: "MaterialEdit",
        component: () => import("@/views/material/edit.vue"),
        meta: { title: "编辑材料" }
      },
    ]
  },


  // 出入库管理
  {
    path: "/records",
    component: Layout,
    redirect: "/records/send/info",
    alwaysShow: true,
    name: "Records",
    meta: { title: "出入库", icon: "el-icon-s-shop", roles: ["editor", "admin"] },
    children: [
      // 发料
      {
        path: "send/info",
        name: "SendInfo",
        component: () => import("@/views/records/sendinfo.vue"),
        meta: { title: "发料", icon: "el-icon-box" }
      },
      {
        path: "send/add",
        hidden: true,
        name: "SendAdd",
        component: () => import("@/views/records/sendadd.vue"),
        meta: { title: "发料详细" }
      },
      // 领料
      {
        path: "receive/info",
        name: "ReceiveInfo",
        component: () => import("@/views/records/receiveinfo.vue"),
        meta: { title: "领料", icon: "el-icon-box" }
      },
      {
        path: "receive/add",
        hidden: true,
        name: "ReceiveAdd",
        component: () => import("@/views/records/receiveadd.vue"),
        meta: { title: "领料详细" }
      },
      // 出入单记录
      {
        path: "record/info",
        name: "RecordInfo",
        component: () => import("@/views/records/list.vue"),
        meta: { title: "领发料记录", icon: "el-icon-box" }
      },
      // {
      //   path: "placeedit/:id",
      //   hidden: true,
      //   name: "PlaceEdit",
      //   component: () => import("@/views/place/placeedit.vue"),
      //   meta: { title: "编辑货架" }
      // },
      // 材料相关
      // {
      //   path: "materialinfo",
      //   name: "MaterialInfo",
      //   component: () => import("@/views/material/info.vue"),
      //   meta: { title: "材料信息", icon: "el-icon-box" }
      // },
      // {
      //   path: "materialadd",
      //   hidden: true,
      //   name: "MaterialAdd",
      //   component: () => import("@/views/material/add.vue"),
      //   meta: { title: "添加材料" }
      // },
      // {
      //   path: "materialedit",
      //   hidden: true,
      //   name: "MaterialEdit",
      //   component: () => import("@/views/material/edit.vue"),
      //   meta: { title: "编辑材料" }
      // },
    ]
  },


  {
    path: "/example",
    component: Layout,
    redirect: "/example/table",
    name: "Example",
    meta: { title: "Example", icon: "el-icon-s-help" },
    children: [
      {
        path: "table",
        name: "Table",
        component: () => import("@/views/table/index"),
        meta: { title: "Table", icon: "table" }
      },
      {
        path: "tree",
        name: "Tree",
        component: () => import("@/views/tree/index"),
        meta: { title: "Tree", icon: "tree" }
      }
    ]
  },

  {
    path: "/form",
    component: Layout,
    children: [
      {
        path: "index",
        name: "Form",
        component: () => import("@/views/form/index"),
        meta: { title: "Form", icon: "form" }
      }
    ]
  },

  {
    path: "/nested",
    component: Layout,
    redirect: "/nested/menu1",
    name: "Nested",
    meta: {
      title: "Nested",
      icon: "nested"
    },
    children: [
      {
        path: "menu1",
        component: () => import("@/views/nested/menu1/index"), // Parent router-view
        name: "Menu1",
        meta: { title: "Menu1" },
        children: [
          {
            path: "menu1-1",
            component: () => import("@/views/nested/menu1/menu1-1"),
            name: "Menu1-1",
            meta: { title: "Menu1-1" }
          },
          {
            path: "menu1-2",
            component: () => import("@/views/nested/menu1/menu1-2"),
            name: "Menu1-2",
            meta: { title: "Menu1-2" },
            children: [
              {
                path: "menu1-2-1",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-1"),
                name: "Menu1-2-1",
                meta: { title: "Menu1-2-1" }
              },
              {
                path: "menu1-2-2",
                component: () =>
                  import("@/views/nested/menu1/menu1-2/menu1-2-2"),
                name: "Menu1-2-2",
                meta: { title: "Menu1-2-2" }
              }
            ]
          },
          {
            path: "menu1-3",
            component: () => import("@/views/nested/menu1/menu1-3"),
            name: "Menu1-3",
            meta: { title: "Menu1-3" }
          }
        ]
      },
      {
        path: "menu2",
        component: () => import("@/views/nested/menu2/index"),
        name: "Menu2",
        meta: { title: "menu2" }
      }
    ]
  },

  {
    path: "external-link",
    component: Layout,
    children: [
      {
        path: "https://panjiachen.github.io/vue-element-admin-site/#/",
        meta: { title: "External Link", icon: "link" }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: "*", redirect: "/404", hidden: true }
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

export default router;
