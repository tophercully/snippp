"use client";
import React from "react";
import { Snippet } from "../../types/typeInterfaces";
import { simplifyNumber } from "../../utils/simplifyNumber";
import Link from "next/link";

interface SnippetCardProps {
    item: Snippet;
    index: number;
    selectedIndex: number;
    snippetMods: {
        [snippetID: number]: {
            favoriteStatus?: boolean;
            favoriteCount?: number;
            copyCount?: number;
            isDeleted?: boolean;
        };
    };
    handleClick: (input: Snippet, index: number) => void;
    itemRefs: React.MutableRefObject<(HTMLElement | null)[]>;
}

const SnippetCard: React.FC<SnippetCardProps> = ({
    item,
    index,
    selectedIndex,
    snippetMods,
    handleClick,
    itemRefs,
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
    const selectedClass =
        index === selectedIndex
            ? "invert dark:invert-0"
            : "active:bg-base-300 dark:invert hover:bg-base-200";

    const commonContent = (
        <>
            <div className="flex w-4/5 flex-col gap-3">
                <div className="flex items-center gap-2 text-2xl">
                    {name}
                    {!isPublic && (
                        <img
                            src="/lock.svg"
                            className="mr-auto h-5 invert"
                            alt="Private"
                        />
                    )}
                </div>
                <h1 className="text-sm">{author}</h1>
            </div>
            <div className="ml-5 flex w-fit flex-col items-end justify-center gap-3 justify-self-end">
                <div className="flex items-center justify-end gap-1">
                    <img
                        src={favorited ? "/heart-full.svg" : "/heart-empty.svg"}
                        className="ml-auto h-5"
                        alt="Favorites"
                    />
                    <p>{simplifyNumber(modifiedFavoriteCount)}</p>
                </div>
            </div>
        </>
    );

    return (
        <>
            <div
                ref={(el) => {
                    itemRefs.current[index] = el;
                }}
                className={`hidden w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 last:border-none hover:cursor-pointer md:flex ${selectedClass}`}
                key={snippetID}
                onClick={() => handleClick(item, index)}
            >
                {commonContent}
            </div>

            <Link
                ref={(el) => {
                    itemRefs.current[index] = el;
                }}
                className={`flex w-full flex-row justify-between border-b border-dashed border-base-300 bg-base-50 p-5 pb-5 last:border-none hover:cursor-alias md:hidden ${selectedClass}`}
                key={snippetID + "crawler"}
                href={`/snippet/${snippetID}`}
            >
                {commonContent}
            </Link>
        </>
    );
};

export default SnippetCard;