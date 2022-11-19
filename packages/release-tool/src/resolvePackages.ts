import fs from "fs";
import path from "path";
import process from "process";
import * as glob from "glob";
import { isWorkspaces } from "./workspace";

export interface WorkspaceInfo {
  /**
   * package名称
   */
  packageName: string;
  /**
   * 所属workspace父级目录
   */
  workspace: string;
}

export const resolvePackages = async (): Promise<WorkspaceInfo[] | false> => {
  const rootPath = process.cwd();
  const workspace = isWorkspaces(rootPath);

  if (workspace) {
    const packages = [];
    workspace.forEach((i) => {
      const files = glob.sync(path.join(rootPath, i));
      files.forEach((item) => {
        const stat = fs.lstatSync(item);
        if (stat.isDirectory() === true) {
          const parentPath = path.resolve(item, "..");
          packages.push({
            packageName: path.basename(item),
            workspace: path.basename(parentPath),
          });
        }
      });
    });
    return packages;
  } else {
    return false;
  }
};