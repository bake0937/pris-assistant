import { Application } from "probot";

export = (app: Application) => {
  // Pull Requestが作成されたタイミングで呼び出されます
  app.on("pull_request.opened", async (context) => {
    // ラベル追加APIを呼び出す際のリクエストパラメータ生成
    const open_add_labels_params = context.issue({
      labels: ["WIP"],
    });

    // 作成された Pull Requestにラベル追加
    await context.github.issues.addLabels(open_add_labels_params);
  });

  app.on("pull_request.closed", async (context) => {
    // ラベル削除APIを呼び出す際のリクエストパラメータ生成
    const labels: Array<string> = ["WIP", "Review"];
    // close するためラベルを削除
    labels.forEach((label) => {
      const remove_labels_params = context.issue({
        name: label,
      });
      context.github.issues.removeLabel(remove_labels_params);
    });

    // Reviewd を貼る
    const close_add_labels_params = context.issue({
      labels: ["Reviewd"],
    });
    context.github.issues.addLabels(close_add_labels_params);
  });
};
