import { animate, stagger } from "https://cdn.jsdelivr.net/npm/motion@12.7.3/+esm";

const dots = document.querySelectorAll(".dot");

animate(
  dots,
  { y: -30 },
  {
    duration: 0.6,
    repeat: Infinity,
    repeatType: "mirror",
    ease: "easeInOut",
    times: [0, 0.5, 1],
    delay: stagger(0.2, { startDelay: -0.5 }),
  }
);

const searchForm = document.getElementById("search");
const searchInput = document.getElementById("searchInput");
const quotesContainer = document.getElementById("quotes");
const randomBtn = document.getElementById("randomBtn");
const loading = document.getElementById("loading");

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const keyword = searchInput.value.trim();
  if (!keyword) return;

  const url = `https://fufufafapi.vanirvan.my.id/api?content=${keyword}`;
  await fetchQuotes(url);

  searchForm.reset();
});

// Get Random Quote
randomBtn.addEventListener("click", () => {
  fetchQuotes("https://fufufafapi.vanirvan.my.id/api/random");
});

window.addEventListener("DOMContentLoaded", () => {
  loading.style.display = "flex";
  fetchQuotes("https://fufufafapi.vanirvan.my.id/api/random");
});

// Get Quotes
async function fetchQuotes(url) {
  try {
    const response = await fetch(url);
    let data = await response.json();

    if (!response.ok) throw new Error(data.error || "Gagal mengambil data dari API");
    if (!Array.isArray(data)) data = [data];

    quotesContainer.innerHTML = renderQuotes(data);
  } catch (err) {
    console.error("Terjadi kesalahan:", err.message);
    quotesContainer.innerHTML = `<p class="text-red-500 text-center">${err.message}!</p>`;
  } finally {
    loading.style.display = "none";
  }
}

// Render Quotes
function renderQuotes(quotes) {
  return quotes
    .map(({ content, doksli, image_url }) => {
      return `
        <div class="w-full break-inside-avoid p-6 bg-foreground/60 border border-light rounded-xl shadow-md shadow-light/40 mx-auto mb-8">
          <div class="w-full">
            <img src="${image_url}" class="object-cover object-left-top rounded-xl" />
          </div>
          <article>
            <p class="mt-6">
              <iconify-icon icon="icon-park-outline:quote" class="inline-block text-2xl mr-2"></iconify-icon>
              ${content}
            </p>
            <div class="flex justify-between gap-4 mt-6">
              <a href="${doksli}" target="_blank"
                 class="flex items-center gap-2 text-xs px-4 py-2 bg-blue-600 rounded-sm tracking-wide transition-colors hover:bg-blue-700 focus:outline-1 focus:outline-light">
                Doksli
                <iconify-icon icon="la:telegram-plane" class="text-xl md:text-2xl"></iconify-icon>
              </a>
              <button onclick="downloadImage('${image_url}')"
                      class="flex items-center gap-2 text-xs px-4 py-2 bg-purple-500 rounded-sm cursor-pointer transition-colors hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500">
                Download
                <iconify-icon icon="si:file-download-line" class="text-xl md:text-2xl"></iconify-icon>
              </button>
            </div>
          </article>
        </div>
      `;
    })
    .join("");
}

// Download Image
async function downloadImage(imageUrl) {
  const response = await fetch(imageUrl);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = blobUrl;
  link.download = "fufufafa.jpg";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(blobUrl);
}

// Expose ke global (untuk onclick di HTML)
window.downloadImage = downloadImage;
