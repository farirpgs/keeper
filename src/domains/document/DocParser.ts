import GithubSlugger from "github-slugger";
import { evaluateMdx } from "../mdx/evaluateMdx";

export type DocType = ReturnType<InstanceType<typeof DocParser>["getDoc"]>;

export class DocParser {
  #content: string;
  #pages: Array<IPageElement>;
  #indexes: Array<ISearchIndex>;
  #currentPage: IPageElement | null;
  #nextPage: IPageElement | null;
  #previousPage: IPageElement | null;
  #sidebar: ISidebar;
  #slugger = new GithubSlugger();
  constructor(
    private options: {
      currentChapterId?: string;
      markdown: string;
    },
  ) {
    const { pages, toc, sidebar, indexes } = this.#extractPages();
    this.#pages = pages;
    this.#indexes = indexes;
    this.#sidebar = sidebar;

    const currentPageId = this.options.currentChapterId ?? this.#pages[0]?.id;
    const currentPageIndex = this.#pages.findIndex(
      (page) => page.id === currentPageId,
    );
    this.#currentPage = this.#pages[currentPageIndex];
    this.#previousPage = this.#pages[currentPageIndex - 1];
    this.#nextPage = this.#pages[currentPageIndex + 1];

    this.#content = this.#currentPage?.content || "";
  }

  getDoc() {
    return {
      pages: this.#pages,
      indexes: this.#indexes,
      sidebar: this.#sidebar,
      numberOfChapters: this.#pages.length,
      numberOfWordsInPage: this.#content.split(" ").length,
      previousPage: this.#previousPage,
      nextPage: this.#nextPage,
      currentPage: this.#currentPage,
    };
  }

  async getMDXContent() {
    const result = await evaluateMdx({
      mdx: this.#currentPage?.content || "",
    });

    return result;
  }

  #extractPages() {
    const pages: Array<IPageElement> = [];
    const toc: Array<ITocElement> = [];
    const sidebar: ISidebar = {
      root: [],
      categories: {},
    };
    const lines = this.options.markdown.split("\n");
    let currentPage: IPageElement | null = null;

    for (const line of lines) {
      // handle page
      if (line.startsWith("# ")) {
        if (currentPage) {
          pages.push(currentPage);
        }

        // handle id generation
        const newIdPrefix = this.makeId({
          line,
        });
        const currentPageId = newIdPrefix;
        // trim title and category
        const [title, category] = line.split("|");
        const trimmedTitle = title.split("#").join("").trim();
        const trimmedCategory = category?.trim();

        // handle sidebar
        if (!trimmedCategory) {
          sidebar.root.push({
            id: currentPageId,
            title: trimmedTitle,
          });
        } else {
          const prev = sidebar.categories[trimmedCategory] ?? [];
          sidebar.categories[trimmedCategory] = [
            ...prev,
            {
              id: currentPageId,
              title: trimmedTitle,
            },
          ];
        }

        currentPage = {
          id: currentPageId,
          gitHubId: this.makeGitHubId({ line }),
          title: trimmedTitle,
          content: "",
          toc: [],
          indexes: [],
        };
      } else {
        if (currentPage) {
          const lineToAdd = line.split("\\#").join("#");
          currentPage.content += lineToAdd + "\n";
        }
      }

      // handle toc
      if (line.startsWith("## ") || line.startsWith("### ")) {
        const level = line.startsWith("## ") ? 2 : 3;
        const title = line.split("#").join("").trim();
        currentPage?.toc.push({
          id: this.makeId({ line }),
          gitHubId: this.makeGitHubId({ line }),
          title: title,
          level: level,
        });
      }
    }

    // adds last page
    if (currentPage) {
      pages.push(currentPage);
    }
    if (currentPage && currentPage.id === this.options.currentChapterId) {
      this.#currentPage = currentPage;
    }

    // add indexes to all pages
    for (const page of pages) {
      page.indexes.push({
        pageId: page.id,
        pageTitle: page.title,
        sectionHash: undefined,
        sectionTitle: undefined,
      });
      for (const tocElement of page.toc) {
        page.indexes.push({
          pageId: page.id,
          pageTitle: page.title,
          sectionHash: tocElement.id,
          sectionTitle: tocElement.title,
        });
      }
    }

    const indexes = pages.flatMap((page) => page.indexes);

    return { pages, toc, sidebar, currentPage, indexes };
  }

  private makeId(p: { line: string }) {
    const lineWithoutHash = p.line.replace("# ", "");
    const lineWithoutDividerSuffix = lineWithoutHash.split("|")[0].trim();
    const lineKebabCase = this.#slugger.slug(lineWithoutDividerSuffix);
    return lineKebabCase;
  }

  private makeGitHubId(p: { line: string }) {
    const lineWithoutHash = p.line.replace("# ", "");
    const lineKebabCase = this.#slugger.slug(lineWithoutHash);
    return lineKebabCase;
  }
}

type ISidebar = {
  root: Array<ISidebarItem>;
  categories: Record<
    string, // category label
    Array<ISidebarItem> // category items
  >;
};

type ISearchIndex = {
  pageId: string;
  pageTitle: string;
  sectionHash: string | undefined;
  sectionTitle: string | undefined;
};

type IPageElement = {
  id: string;
  gitHubId: string;
  title: string;
  content: string;
  toc: Array<ITocElement>;
  indexes: Array<ISearchIndex>;
};

type ITocElement = {
  id: string;
  gitHubId: string;
  title: string;
  level: number;
};

type ISidebarItem = {
  id: string;
  title: string;
};
