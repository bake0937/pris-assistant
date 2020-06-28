import { Application } from "probot";

export = (app: Application) => {
  // Pull Requestが作成されたタイミングで呼び出されます
  app.on("pull_request.opened", async (context) => {
    const open_add_labels: Array<string> = process.env.OPEN_ADD_LABELS as any;
    // ラベル追加APIを呼び出す際のリクエストパラメータ生成
    const open_add_labels_params = context.issue({
      labels: open_add_labels,
    });

    // 作成された Pull Requestにラベル追加
    await context.github.issues.addLabels(open_add_labels_params);
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
    const close_add_labels: Array<string> = process.env.CLOSE_ADD_LABELS as any;
    const close_add_labels_params = context.issue({
      labels: close_add_labels,
    });
    context.github.issues.addLabels(close_add_labels_params);
  });
};
