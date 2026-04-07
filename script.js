const skills = [
  'C', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
  'Express', 'MongoDB', 'MySQL', 'Git', 'Linux', 'HTML', 'CSS'
];

const curatedProjects = [
  {
    name: 'ecommerce-template',
    summary: 'Modern e-commerce starter with scalable architecture and deploy-ready structure.',
    category: 'Web',
    stars: 1,
    updatedAt: '2026-04-06',
    tech: ['Next.js', 'Node.js', 'MongoDB', 'Docker'],
    repo: 'https://github.com/Aryan-singh19/ecommerce-template'
  },
  {
    name: 'AI-ML',
    summary: 'Practical ML experiments, model notebooks, and iterative learning projects.',
    category: 'AI/ML',
    stars: 1,
    updatedAt: '2026-04-05',
    tech: ['Python', 'ML', 'Data'],
    repo: 'https://github.com/Aryan-singh19/AI-ML'
  },
  {
    name: 'DSA',
    summary: 'Structured DSA practice repository covering arrays, trees, graphs, and problems.',
    category: 'Problem Solving',
    stars: 1,
    updatedAt: '2026-04-04',
    tech: ['C++', 'Algorithms', 'Data Structures'],
    repo: 'https://github.com/Aryan-singh19/DSA'
  },
  {
    name: 'Students_View',
    summary: 'Student-centric frontend interface focused on usability and clean layouts.',
    category: 'Web',
    stars: 1,
    updatedAt: '2026-04-03',
    tech: ['HTML', 'CSS', 'JavaScript'],
    repo: 'https://github.com/Aryan-singh19/Students_View'
  },
  {
    name: 'class-solutions',
    summary: 'Assignment notes and solved coding questions organized for faster revision.',
    category: 'Academic',
    stars: 2,
    updatedAt: '2026-04-02',
    tech: ['HTML', 'Notes', 'Practice'],
    repo: 'https://github.com/Aryan-singh19/class-solutions'
  }
];

let projects = [...curatedProjects];

const state = {
  activeTag: 'All',
  search: '',
  sort: 'featured',
  selectedProject: null
};

const el = {
  tagFilters: document.getElementById('tagFilters'),
  projectsGrid: document.getElementById('projectsGrid'),
  skillsWrap: document.getElementById('skillsWrap'),
  searchInput: document.getElementById('searchInput'),
  sortSelect: document.getElementById('sortSelect'),
  repoCount: document.getElementById('repoCount'),
  skillCount: document.getElementById('skillCount'),
  apiStatus: document.getElementById('apiStatus'),
  year: document.getElementById('year'),
  modal: document.getElementById('projectModal'),
  modalTag: document.getElementById('modalTag'),
  modalTitle: document.getElementById('modalTitle'),
  modalDesc: document.getElementById('modalDesc'),
  modalTech: document.getElementById('modalTech'),
  modalRepo: document.getElementById('modalRepo'),
  closeModal: document.getElementById('closeModal'),
  copyRepo: document.getElementById('copyRepo')
};

function uniqueTags() {
  return ['All', ...new Set(projects.map((p) => p.category))];
}

function filteredProjects() {
  const q = state.search.trim().toLowerCase();
  const byTag = projects.filter((p) => state.activeTag === 'All' || p.category === state.activeTag);
  const bySearch = byTag.filter((p) => {
    if (!q) return true;
    const haystack = [p.name, p.summary, p.category, ...p.tech].join(' ').toLowerCase();
    return haystack.includes(q);
  });

  if (state.sort === 'stars') {
    return bySearch.sort((a, b) => b.stars - a.stars || a.name.localeCompare(b.name));
  }

  if (state.sort === 'updated') {
    return bySearch.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  return bySearch;
}

function renderTags() {
  el.tagFilters.innerHTML = uniqueTags()
    .map((tag) => {
      const active = state.activeTag === tag;
      return `<button data-tag="${tag}" class="rounded-full border px-3 py-1.5 text-xs font-semibold transition ${
        active
          ? 'border-mint bg-mint/20 text-mint'
          : 'border-white/20 bg-white/5 text-slate-200 hover:border-amberx/60 hover:text-white'
      }">${tag}</button>`;
    })
    .join('');
}

function projectCard(project, i) {
  const techBadges = project.tech
    .slice(0, 3)
    .map((t) => `<span class="rounded-md bg-white/10 px-2 py-1 text-[11px] text-slate-200">${t}</span>`)
    .join('');

  return `
    <article class="card-enter glass group rounded-2xl p-4 transition hover:-translate-y-1 hover:border-mint/40" style="animation-delay:${i * 40}ms">
      <div class="flex items-start justify-between gap-3">
        <p class="font-mono text-[11px] uppercase tracking-widest text-mint">${project.category}</p>
        <p class="text-xs text-slate-300">⭐ ${project.stars}</p>
      </div>

      <h3 class="mt-2 text-xl font-bold text-white">${project.name}</h3>
      <p class="mt-2 text-sm leading-relaxed text-slate-300">${project.summary}</p>

      <div class="mt-3 flex flex-wrap gap-1.5">${techBadges}</div>

      <div class="mt-4 flex gap-2">
        <a href="${project.repo}" target="_blank" rel="noreferrer" class="rounded-lg border border-white/20 px-3 py-1.5 text-xs font-semibold text-slate-100 hover:border-mint">Repo</a>
        <button data-open="${project.name}" class="rounded-lg bg-amberx px-3 py-1.5 text-xs font-bold text-slate-950 hover:bg-orange-300">Quick View</button>
      </div>
    </article>
  `;
}

function renderProjects() {
  const list = filteredProjects();

  if (!list.length) {
    el.projectsGrid.innerHTML = '<div class="glass rounded-2xl p-6 text-sm text-slate-300 md:col-span-2 xl:col-span-3">No matching projects found. Try another keyword or tag.</div>';
    return;
  }

  el.projectsGrid.innerHTML = list.map((p, i) => projectCard(p, i)).join('');
}

function renderSkills() {
  el.skillsWrap.innerHTML = skills
    .map(
      (s) =>
        `<span class="rounded-full border border-cyan-300/35 bg-cyan-300/10 px-3 py-1.5 text-sm font-semibold text-cyan-100">${s}</span>`
    )
    .join('');
}

function updateStats() {
  el.repoCount.textContent = projects.length;
  el.skillCount.textContent = skills.length;
}

function inferCategory(repoName, language) {
  const name = repoName.toLowerCase();
  if (name.includes('ai') || name.includes('ml')) return 'AI/ML';
  if (name.includes('dsa') || name.includes('algo')) return 'Problem Solving';
  if (name.includes('class') || name.includes('student')) return 'Academic';
  if (language === 'HTML' || language === 'JavaScript' || language === 'TypeScript') return 'Web';
  return 'Project';
}

function formatDateISO(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toISOString().slice(0, 10);
}

async function loadLiveRepoData() {
  try {
    const res = await fetch('https://api.github.com/users/Aryan-singh19/repos?per_page=100&sort=updated');
    if (!res.ok) throw new Error(`GitHub API returned ${res.status}`);
    const repos = await res.json();

    const merged = curatedProjects.map((project) => {
      const match = repos.find((r) => r.name.toLowerCase() === project.name.toLowerCase());
      if (!match) return project;
      return {
        ...project,
        summary: match.description || project.summary,
        stars: typeof match.stargazers_count === 'number' ? match.stargazers_count : project.stars,
        updatedAt: formatDateISO(match.updated_at) || project.updatedAt,
        repo: match.html_url || project.repo,
        category: project.category || inferCategory(match.name, match.language),
        tech: project.tech?.length
          ? project.tech
          : [match.language, ...(match.topics || [])].filter(Boolean).slice(0, 4)
      };
    });

    const curatedNames = new Set(curatedProjects.map((p) => p.name.toLowerCase()));
    const extra = repos
      .filter((r) => !r.fork && !curatedNames.has(r.name.toLowerCase()))
      .slice(0, 6)
      .map((r) => ({
        name: r.name,
        summary: r.description || 'Repository from my GitHub profile.',
        category: inferCategory(r.name, r.language),
        stars: r.stargazers_count || 0,
        updatedAt: formatDateISO(r.updated_at),
        tech: [r.language, ...(r.topics || [])].filter(Boolean).slice(0, 4),
        repo: r.html_url
      }));

    projects = [...merged, ...extra];

    if (el.apiStatus) {
      el.apiStatus.textContent = `Live synced from GitHub API (${projects.length} repos shown).`;
    }
  } catch (error) {
    if (el.apiStatus) {
      el.apiStatus.textContent = 'Using local project data (GitHub API unavailable right now).';
    }
  }
}

function openModalByName(projectName) {
  const project = projects.find((p) => p.name === projectName);
  if (!project) return;

  state.selectedProject = project;
  el.modalTag.textContent = project.category;
  el.modalTitle.textContent = project.name;
  el.modalDesc.textContent = project.summary;
  el.modalRepo.href = project.repo;
  el.modalTech.innerHTML = project.tech
    .map((t) => `<span class="rounded-full border border-white/20 bg-white/5 px-3 py-1 text-xs text-slate-100">${t}</span>`)
    .join('');

  el.modal.classList.remove('hidden');
  el.modal.classList.add('flex');
}

function closeModal() {
  el.modal.classList.remove('flex');
  el.modal.classList.add('hidden');
  state.selectedProject = null;
}

function bindEvents() {
  el.tagFilters.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-tag]');
    if (!btn) return;
    state.activeTag = btn.dataset.tag;
    renderTags();
    renderProjects();
  });

  el.projectsGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-open]');
    if (!btn) return;
    openModalByName(btn.dataset.open);
  });

  el.searchInput.addEventListener('input', (e) => {
    state.search = e.target.value;
    renderProjects();
  });

  el.sortSelect.addEventListener('change', (e) => {
    state.sort = e.target.value;
    renderProjects();
  });

  el.closeModal.addEventListener('click', closeModal);

  el.modal.addEventListener('click', (e) => {
    if (e.target === el.modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
  });

  el.copyRepo.addEventListener('click', async () => {
    if (!state.selectedProject) return;
    try {
      await navigator.clipboard.writeText(state.selectedProject.repo);
      el.copyRepo.textContent = 'Copied';
      setTimeout(() => {
        el.copyRepo.textContent = 'Copy Link';
      }, 1200);
    } catch (_) {
      el.copyRepo.textContent = 'Copy failed';
      setTimeout(() => {
        el.copyRepo.textContent = 'Copy Link';
      }, 1200);
    }
  });
}

async function init() {
  el.year.textContent = new Date().getFullYear();
  await loadLiveRepoData();
  renderTags();
  renderProjects();
  renderSkills();
  updateStats();
  bindEvents();
}

init();
