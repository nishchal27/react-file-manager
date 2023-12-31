"use client";

import { trpc } from "@/app/_trpc/client";
import { Loader2, DownloadCloud, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";

type FileInfo = {
  id: string;
  name: string;
  code: string;
  url: string;
};

type FileItemProps = {
  file: FileInfo;
};

const FileItem: React.FC<FileItemProps> = ({ file }) => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const [digitCode, setDigitCode] = useState<string | null>(null);
  const [checkCode, setCheckCode] = useState<boolean>(false);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  //function to check 6 digit code
  const checkCodeHandler = (fileCode: string) => {
    if (digitCode === fileCode) {
      setCheckCode(true);
    }
  };

  // Function will execute on click of the download button
  const onClickFileDownload = (fileInfo: FileInfo) => {
    // using Java Script method to get PDF file
    fetch(fileInfo?.url).then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = document.createElement("a");
        alink.href = fileURL;
        alink.download = `${fileInfo?.name}`;
        alink.click();
      });
    });
  };

  const { mutate: deleteFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <>
      <li
        key={file.id}
        className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition hover:shadow-lg"
      >
        <Link href={`/dashboard/${file.id}`} className="flex flex-col gap-2">
          <div className="pt-6 px-6 flex w-full items-center justify-between space-x-6">
            <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
            <div className="flex-1 truncate">
              <div className="flex items-center space-x-3">
                <h3 className="truncate text-lg font-medium text-zinc-900">
                  {file.name}
                </h3>
              </div>
              {checkCode ? (
                <span className="text-sm text-green-700">
                  File is Ready to Download
                </span>
              ) : (
                <span className="text-sm text-red-700">
                  Enter 6 digit code to download <br /> file: {file?.code}
                </span>
              )}
            </div>
          </div>
        </Link>

        <div className="px-6 mt-4 grid grid-cols-3 place-items-center py-2 gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <Input
              type="number"
              onChange={(e) => {
                setDigitCode(e?.target?.value);
              }}
            />
          </div>

          <div
            className={`flex items-center gap-2 ${
              checkCode ? "cursor-pointer" : "cursor-not-allowed"
            }`}
          >
            {!checkCode ? (
              <Button
                size="sm"
                className="w-full"
                variant="secondary"
                onClick={() => {
                  checkCodeHandler(file?.code);
                }}
              >
                <Plus className="h-4 w-4" />
                click
              </Button>
            ) : (
              <Button
                onClick={() => onClickFileDownload(file)}
                disabled={!checkCode}
                size="sm"
                className="w-full"
                variant="outline"
              >
                <DownloadCloud className="h-4 w-4" />
                Download
              </Button>
            )}
          </div>

          <Button
            onClick={() => deleteFile({ id: file.id })}
            size="sm"
            className="w-full"
            variant="destructive"
          >
            {currentlyDeletingFile === file.id ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash className="h-4 w-4" />
            )}
          </Button>
        </div>
      </li>
    </>
  );
};

export default FileItem;
