import { loadAllSnippets } from "./loader/loadAllSnippets";
import { loadFavorites } from "./loader/loadFavorites";
import { loadSnippetById } from "./loader/loadSnippetByID";
import { loadUserSnippets } from "./loader/loadUserSnippets";
import { addCopy } from "./snippet/addCopy";
import { deleteSnippet } from "./snippet/deleteSnippet";
import { updateSnippet } from "./snippet/editSnippet";
import { newSnippet } from "./snippet/newSnippet";
import {
  editUserProfile,
  fetchAllUsers,
  fetchUserProfile,
  fetchUserStats,
  newUser,
  setUserRole,
} from "./user/userFunctions";
import {
  addListToStaffPicks,
  addSnippetToList,
  createList,
  deleteList,
  getList,
  getListSnippets,
  getListsWithSnippetStatus,
  getStaffPicks,
  getUserLists,
  removeListFromStaffPicks,
  removeSnippetFromList,
  updateList,
} from "./list/listFunctions";
import { addSnippetToFavorites } from "./favorite/addFavorite";
import { removeSnippetFromFavorites } from "./favorite/removeFavorite";
import { fetchExtendedStats, fetchStats } from "./fetchStats";

const api = {
  users: {
    create: newUser,
    getProfile: fetchUserProfile,
    updateProfile: editUserProfile,
    setRole: setUserRole,
    getStatsById: fetchUserStats,
    getAll: fetchAllUsers,
  },
  snippets: {
    loadAll: loadAllSnippets,
    loadFavorites: loadFavorites,
    loadById: loadSnippetById,
    loadByUserId: loadUserSnippets,
    loadByListId: getListSnippets,
    addCopy: addCopy,
    delete: deleteSnippet,
    update: updateSnippet,
    create: newSnippet,
    addToList: addSnippetToList,
    removeFromList: removeSnippetFromList,
  },
  lists: {
    create: createList,
    update: updateList,
    get: getList,
    delete: deleteList,
    getByUserId: getUserLists,
    getWithSnippetStatus: getListsWithSnippetStatus,
  },
  staffPicks: {
    get: getStaffPicks,
    addList: addListToStaffPicks,
    removeList: removeListFromStaffPicks,
  },
  favorites: {
    add: addSnippetToFavorites,
    remove: removeSnippetFromFavorites,
  },
  stats: {
    get: fetchStats,
    getExtended: fetchExtendedStats,
  },
};
export default api;
