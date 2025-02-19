import Link from "next/link";
import { Snippet } from "../../types/typeInterfaces";
import { simplifyNumber } from "../../utils/simplifyNumber";
import { useWindowSize } from "@uidotdev/usehooks";

interface ListSnippetItemProps {
  item: Snippet;
  index: number;
  snippetMods: {
    [snippetID: number]: {
      favoriteStatus?: boolean;
      favoriteCount?: number;
    };
  };
  selectedIndex: number;
  itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  mobileItemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
  handleClick: (item: Snippet, index: number) => void;
}

const ListSnippetItem: React.FC<ListSnippetItemProps> = ({
  item,
  index,
  snippetMods,
  selectedIndex,
  itemRefs,
  mobileItemRefs,
  handleClick,
}) => {
  const {
    snippetID,
    name,
    author,
    favoriteCount,
    isFavorite,
    public: isPublic,
  } = item;
  const mod = snippetMods[Number(snippetID)];
  const modifiedFavoriteCount = mod?.favoriteCount ?? favoriteCount ?? 0;
  const favorited = mod?.favoriteStatus ?? isFavorite ?? false;
  const { width } = useWindowSize();
  const isMobile = (width as number) < 768;
  const selectedClass =
    index === selectedIndex ?
      "invert dark:invert-0"
    : "active:bg-base-150 dark:invert hover:bg-base-100";

  return (
    <>
      {!isMobile ?
        <div
          ref={(el) => {
            itemRefs.current[index] = el;
          }}
          className={`hidden w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-3 pb-5 last:border-none hover:cursor-pointer md:flex ${selectedClass}`}
          key={snippetID}
          onClick={() => handleClick(item, index)}
        >
          <div className="flex w-4/5 flex-col gap-1 text-black">
            <div className="flex items-center gap-2 text-lg font-medium">
              {name}
              {!isPublic && (
                <img
                  src="/lock.svg"
                  className="mr-auto h-5 invert"
                  alt="Private"
                />
              )}
            </div>
            <h1 className="text-xs">{author}</h1>
          </div>
          <div className="ml-5 flex w-fit flex-col items-end justify-center gap-3 justify-self-end">
            <div className="flex items-center justify-end gap-1">
              <img
                src={favorited ? "/heart-full.svg" : "/heart-empty.svg"}
                className="ml-auto h-5"
                alt="Favorites"
              />
              <p className="dark:invert">
                {simplifyNumber(modifiedFavoriteCount)}
              </p>
            </div>
          </div>
        </div>
      : <Link
          ref={(el) => {
            mobileItemRefs.current[index] = el;
          }}
          className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-3 pb-5 last:border-none hover:cursor-alias md:hidden ${selectedClass}`}
          key={snippetID + "crawler"}
          href={`/snippet/${snippetID}`}
        >
          <div className="flex w-4/5 flex-col gap-1 text-black">
            <div className="flex items-center gap-2 text-lg font-medium">
              {name}
              {!isPublic && (
                <img
                  src="/lock.svg"
                  className="mr-auto h-5 invert"
                  alt="Private"
                />
              )}
            </div>
            <h1 className="text-xs">{author}</h1>
          </div>
          <div className="ml-5 flex w-fit flex-col items-end justify-center gap-3 justify-self-end">
            <div className="flex items-center justify-end gap-1">
              <img
                src={favorited ? "/heart-full.svg" : "/heart-empty.svg"}
                className="ml-auto h-5"
                alt="Favorites"
              />
              <p className="dark:invert">
                {simplifyNumber(modifiedFavoriteCount)}
              </p>
            </div>
          </div>
        </Link>
      }
    </>
  );
};

export default ListSnippetItem;
