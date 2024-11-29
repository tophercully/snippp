import { ListData } from "../../types/typeInterfaces";
import { formatDescription } from "../../utils/formatDescription";
import TooltipWrapper from "../universal/TooltipWrapper";

interface ListCardProps {
  list: ListData;
  index: number;
}
const ListCard = ({ list, index }: ListCardProps) => {
  return (
    <a
      key={index}
      href={`/list/${list.listid}`}
      className="group h-full relative z-30 flex  flex-col rounded-sm border border-dashed border-special bg-white duration-200 ease-in hover:-translate-y-[4px] hover:bg-base-200 hover:shadow-lg dark:bg-base-900 dark:text-white dark:hover:bg-base-800"
    >
      <div className="z-30 h-full bg-base-100 p-4 duration-200 group-hover:bg-base-50 dark:bg-base-850 group-hover:dark:bg-base-950">
        <div className="mb-4 flex items-center justify-between gap-2">
          <TooltipWrapper
            tooltip="This is a list"
            position="left"
          >
            <img
              src="folder.svg"
              className="h-6 w-6 invert dark:invert-0"
              alt="Folder icon"
            />
          </TooltipWrapper>
          <TooltipWrapper
            tooltip="# of snippets in the list"
            position="right"
          >
            <p className="w-fit text-sm">{list.snippet_count}</p>
          </TooltipWrapper>
        </div>

        <div className="mb-4 flex min-w-0 flex-col">
          <h3 className="truncate text-xl font-semibold">{list.listname}</h3>
          <p className="truncate text-sm text-base-600 dark:text-base-400">
            {list.author}
          </p>
        </div>

        {list?.description && (
          <div className="flex-grow pb-4">
            <p
              className={`line-clamp-2 overflow-hidden font-thin transition-all duration-300`}
              dangerouslySetInnerHTML={{
                __html: formatDescription(list.description),
              }}
            ></p>
          </div>
        )}
        <div className="flex flex-wrap">
          {list.listtags?.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              className="mr-2 mt-2 rounded-sm bg-base-200 px-2 py-1 text-xs text-base-700 dark:bg-base-800 dark:text-base-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
};
export default ListCard;
