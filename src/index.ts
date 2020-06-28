import { Application } from "probot";

export = (app: Application) => {
  // Pull Requestが作成されたタイミングで呼び出されます
  app.on("pull_request.opened", async (context) => {
    const open_add_labels: string = process.env.OPEN_ADD_LABELS as any;
    // ラベル追加APIを呼び出す際のリクエストパラメータ生成
    open_add_labels.split(",").forEach((open_add_label) => {
      const open_add_labels_params = context.issue({
        name: open_add_label,
      });
      // 作成された Pull Requestにラベル追加
      context.github.issues.replaceLabels(open_add_labels_params);
    });
  });

  app.on("pull_request.closed", async (context) => {
    // ラベル削除APIを呼び出す際のリクエストパラメータ生成
    const close_remove_labels: string = process.env.CLOSE_REMOVE_LABELS as any;
    // close するためラベルを削除
    close_remove_labels.split(",").forEach((close_remove_label) => {
      const remove_labels_params = context.issue({
        name: close_remove_label,
      });
      context.github.issues.removeLabel(remove_labels_params);
    });

    // Reviewd を貼る
    const close_add_labels: string = process.env.CLOSE_ADD_LABELS as any;
    close_add_labels.split(",").forEach((close_add_label) => {
      const close_add_labels_params = context.issue({
        name: close_add_label,
      });
      context.github.issues.replaceLabels(close_add_labels_params);
    });
  });
};
