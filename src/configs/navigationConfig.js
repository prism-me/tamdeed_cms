import React from "react";
import * as Icon from "react-feather";
import { CgProductHunt } from "react-icons/cg";

const navigationConfig = [
  {
    id: "dashboard",
    title: "Dashboard",
    type: "item",
    icon: <Icon.Home size={20} />,
    navLink: "/",
    // badge: "warning",
    // badgeText: "2",

  },
  //! -----------Home Page---------
  {
    id: "homePage",
    title: "Home",
    type: "item",
    icon: <Icon.Home size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/home-page",
  },
  //! -----------aboutUs Page---------
  {
    id: "about",
    title: "About Us",
    type: "item",
    icon: <Icon.ArrowRightCircle size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/about",
  },

  // !--------------out team-------
  {
    id: "TeamForm",
    title: "Our Team",
    type: "item",
    icon: <Icon.Users size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/Team/list",
  },
  // !--------------out projects-------
  {
    id: "IndustryForm",
    title: "Our Industry",
    type: "item",
    icon: <Icon.Star size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/Industry/list",
  },
  // !--------------Reference Project-------
  {
    id: "ReferenceProjectForm",
    title: "Reference Project",
    type: "item",
    icon: <Icon.Award size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/ReferenceProject/list",
  },
  // !-------------- Partners / Brands -------
  {
    id: "PartnerForm",
    title: "Partners",
    type: "item",
    icon: <Icon.Users size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/Partner/list",
  },
  {
    id: "emailQueries",
    title: "User Emails",
    type: "item",
    icon: <Icon.Mail size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/queries",
  },
  {
    id: "userQueries",
    title: "User Queries",
    type: "item",
    icon: <Icon.HelpCircle size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/user/queries",
  },

  // !--------------SolutionAndServices-------
  {
    id: "SolutionAndServices",
    title: "Solution And Services",
    type: "item",
    icon: <Icon.Tool size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/SolutionAndServices/list",
  },
  // !--------------SolutionAndServices-------
  {
    id: "mediaCenter",
    title: "Media Center",
    type: "item",
    icon: <Icon.Monitor size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/MediaCenter/list",
  },
  {
    id: "pages",
    title: "Pages",
    type: "item",
    icon: <Icon.Paperclip size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/pages",
  },

  //! -----------academics Page---------
  // {
  //   id: "academics",
  //   title: "Academics",
  //   type: "item",
  //   icon: <Icon.CheckCircle size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/academics",
  // },

  //! -----------AgsPortal---------
  // {
  //   id: "AgsPortal",
  //   title: "Ags Portal",
  //   type: "item",
  //   icon: <Icon.LogOut size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/AgsPortal",
  // },
  //!--------------Enroll-------
  // {
  //   id: "Enroll",
  //   title: "Enroll",
  //   type: "item",
  //   icon: <Icon.ExternalLink size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/Enroll",
  // },
  //!--------------Career-------
  // {
  //   id: "career",
  //   title: "Career",
  //   type: "item",
  //   icon: <Icon.Video size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/career",
  // },
  // !--------------Post Opportunuty-------
  {
    id: "JobOpportunuty",
    title: "Job Opportunuty",
    type: "item",
    icon: <Icon.Calendar size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/post-opportunity/list",
  },
  //!-----------Our Curriculum----------
  // {
  //   id: "OurCurriculum",
  //   title: "Our Curriculum",
  //   type: "collapse",
  //   icon: <Icon.BookOpen size={15} />,
  //   children: [
  //     {
  //       id: "Kindergarten",
  //       title: "Kindergarten",
  //       type: "item",
  //       icon: <Icon.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/kindergarten",
  //     },
  //     {
  //       id: "PrimarySchool",
  //       title: "Primary School",
  //       type: "item",
  //       icon: <Icon.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/primarySchool",
  //     },
  //     {
  //       id: "MiddleSchool",
  //       title: "Middle School",
  //       type: "item",
  //       icon: <Icon.Circle size={12} />,
  //       permissions: ["admin", "editor"],
  //       navLink: "/MiddleSchool",
  //     },
  //   ],
  // },
  //!--------------Student Care-------
  // {
  //   id: "StudentCareList",
  //   title: "Student Care List",
  //   type: "item",
  //   icon: <Icon.Circle size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/StudentCare/list",
  // },

  //!--------------Events-------
  // {
  //   id: "Events",
  //   title: "Events",
  //   type: "item",
  //   icon: <Icon.Calendar size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/Events/list",
  // },

    //!--------------Mentors-------
    // {
    //   id: "MentorsForm",
    //   title: "Meet Mentors",
    //   type: "item",
    //   icon: <Icon.Users size={12} />,
    //   permissions: ["admin", "editor"],
    //   navLink: "/Mentors/list",
    // },

  //!--------------ExperienceAgsForm-------
  // {
  //   id: "videosForm",
  //   title: "Experience Ags",
  //   type: "item",
  //   icon: <Icon.Video size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/experienceAgs/list",
  // },
  //!--------------LifeAtAgsForm-------
  // {
  //   id: "LifeAtAgsForm",
  //   title: "Life At AGS",
  //   type: "item",
  //   icon: <Icon.Video size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/LifeAtAgs/list",
  // },


  //!--------------Pages-------


  //!-------FAQ-----------
  // {
  //   id: "questionAndAnswersForm",
  //   title: "FAQ",
  //   type: "item",
  //   icon: <Icon.HelpCircle size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/faqs/form",
  // },

  //!---------------Users------
  // {
  //   id: "users",
  //   title: "Registered Users",
  //   type: "item",
  //   icon: <Icon.User size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/users-list",
  // },
  //!---------------Header------
  // {
  //   id: "header",
  //   title: "Header",
  //   type: "item",
  //   icon: <Icon.Flag size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/header",
  // },
  //!---------------Footer------
  {
    id: "footer",
    title: "Footer",
    type: "item",
    icon: <Icon.CheckSquare size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/footer",
  },
  //!---------------FormsDropDown------
  // {
  //   id: "FormsDropDown",
  //   title: "Filter Queries",
  //   type: "item",
  //   icon: <Icon.ShoppingBag size={12} />,
  //   permissions: ["admin", "editor"],
  //   navLink: "/AGSForms",
  // },
  //!-------------Gallery--------
  {
    id: "gallery",
    title: "Gallery",
    type: "item",
    icon: <Icon.Image size={12} />,
    permissions: ["admin", "editor"],
    navLink: "/gallery",
  },
];

export default navigationConfig;
