import axios from "axios";

async function fetchLinkPreview(url) {
  try {
    const response = await axios.get(
      `https://api.linkpreview.net/?key=${
        import.meta.env.VITE_LINK_PREVIEW_API_KEY
      }&q=${url}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching link preview:", error);
    return null;
  }
}

export default fetchLinkPreview;
