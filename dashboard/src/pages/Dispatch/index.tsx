import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Radio,
  Segmented,
  Spin,
  Tag,
} from "antd";
import {
  Code2,
  MessageSquareText,
  Plus,
  Send,
  ShoppingBag,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import PageShell from "../../layouts/PageShell";
import styles from "./index.module.less";

type Role = "purchase" | "software";
type View = "ready" | "loading" | "failed";
type Task = {
  id: string;
  role: Role;
  title: string;
  draft: string;
  messages: string[];
  confirmed: boolean;
  view: View;
  supplier: "A" | "B";
};
const makeTask = (role: Role, title: string): Task => ({
  id: crypto.randomUUID(),
  role,
  title,
  draft: "",
  messages: [],
  confirmed: false,
  view: "ready",
  supplier: "A",
});

export default function DispatchPage() {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selected, setSelected] = useState("");
  const [pane, setPane] = useState("chat");
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<{ title: string; role: Role }>();
  const task = tasks.find((item) => item.id === selected);
  const update = (patch: Partial<Task>) =>
    setTasks((items) =>
      items.map((item) =>
        item.id === selected ? { ...item, ...patch } : item,
      ),
    );
  const loadExamples = () => {
    const items = [
      makeTask("purchase", t("dispatch.examples.purchase")),
      makeTask("software", t("dispatch.examples.software")),
    ];
    setTasks(items);
    setSelected(items[0].id);
  };
  const send = () => {
    if (!task?.draft.trim()) return;
    update({
      messages: [...task.messages, task.draft.trim()],
      draft: "",
      confirmed: false,
    });
  };
  const title = task?.title ?? t("dispatch.chat");

  return (
    <PageShell
      title={t("nav.dispatch")}
      subtitle={t("dispatch.subtitle")}
      fill
      actions={
        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={() => setCreating(true)}
        >
          {t("dispatch.create")}
        </Button>
      }
    >
      <div className={styles.notice}>
        <Tag>{t("dispatch.example")}</Tag>
        {t("dispatch.demoNotice")}
      </div>
      <div className={styles.switcher}>
        <Segmented
          block
          value={pane}
          onChange={setPane}
          options={["tasks", "chat", "results"].map((value) => ({
            value,
            label: t(`dispatch.${value}`),
          }))}
        />
      </div>
      <div className={styles.workspace} data-pane={pane}>
        <section
          className={`${styles.panel} ${styles.tasks}`}
          aria-label={t("dispatch.tasks")}
        >
          <h2>
            {t("dispatch.tasks")} <Tag>{tasks.length}</Tag>
          </h2>
          <div className={styles.scroll}>
            {tasks.length ? (
              tasks.map((item) => (
                <button
                  type="button"
                  key={item.id}
                  className={styles.task}
                  aria-pressed={item.id === selected}
                  onClick={() => {
                    setSelected(item.id);
                    setPane("chat");
                  }}
                >
                  <span>
                    {item.role === "purchase" ? (
                      <ShoppingBag size={16} />
                    ) : (
                      <Code2 size={16} />
                    )}
                    {item.title}
                  </span>
                  <small>
                    {t(`dispatch.roles.${item.role}`)} ·{" "}
                    {t(
                      item.confirmed
                        ? "dispatch.statusConfirmed"
                        : "dispatch.statusDraft",
                    )}
                  </small>
                </button>
              ))
            ) : (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={t("dispatch.noTasks")}
              />
            )}
          </div>
          {!tasks.length && (
            <Button onClick={loadExamples}>{t("dispatch.loadExamples")}</Button>
          )}
        </section>
        <section
          className={`${styles.panel} ${styles.chat}`}
          aria-label={t("dispatch.chat")}
        >
          <h2>
            <MessageSquareText size={17} />
            {title}
          </h2>
          {task ? (
            <>
              <div className={styles.scroll}>
                <div className={styles.intro}>
                  <strong>{t(`dispatch.roles.${task.role}`)}</strong>
                  <p>{t(`dispatch.intro.${task.role}`)}</p>
                </div>
                <div
                  className={styles.messages}
                  role="log"
                  aria-label={t("dispatch.messages")}
                >
                  {task.messages.map((message, i) => (
                    <div className={styles.message} key={i}>
                      {message}
                    </div>
                  ))}
                </div>
                <Card
                  size="small"
                  title={t("dispatch.requirement")}
                  extra={<Tag>{t("dispatch.example")}</Tag>}
                >
                  <p>
                    {task.messages.at(-1) ??
                      t(`dispatch.requirements.${task.role}`)}
                  </p>
                  <p className={styles.meta}>{t("dispatch.confirmHint")}</p>
                  <Button
                    type="primary"
                    disabled={task.confirmed}
                    onClick={() => update({ confirmed: true })}
                  >
                    {t(
                      task.confirmed
                        ? "dispatch.confirmed"
                        : "dispatch.confirm",
                    )}
                  </Button>
                </Card>
              </div>
              <form
                className={styles.composer}
                onSubmit={(event) => {
                  event.preventDefault();
                  send();
                }}
              >
                <Input.TextArea
                  aria-label={t("dispatch.message")}
                  value={task.draft}
                  onChange={(event) => update({ draft: event.target.value })}
                  placeholder={t("dispatch.messagePlaceholder")}
                  autoSize={{ minRows: 2, maxRows: 5 }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<Send size={15} />}
                  disabled={!task.draft.trim()}
                >
                  {t("dispatch.send")}
                </Button>
              </form>
            </>
          ) : (
            <Empty description={t("dispatch.empty")} />
          )}
        </section>
        <section
          className={`${styles.panel} ${styles.results}`}
          aria-label={t("dispatch.results")}
        >
          <h2>
            {t("dispatch.results")} <Tag>{t("dispatch.example")}</Tag>
          </h2>
          {task ? (
            <div className={styles.scroll}>
              {task.view === "loading" ? (
                <div className={styles.empty} role="status">
                  <Spin />
                  <p>{t("dispatch.loading")}</p>
                </div>
              ) : task.view === "failed" ? (
                <Alert
                  type="error"
                  message={t("dispatch.failed")}
                  action={
                    <Button
                      size="small"
                      onClick={() => update({ view: "ready" })}
                    >
                      {t("dispatch.retry")}
                    </Button>
                  }
                />
              ) : task.role === "purchase" ? (
                <>
                  <p className={styles.meta}>
                    {t(
                      task.confirmed
                        ? "dispatch.resultHint"
                        : "dispatch.waitingConfirmation",
                    )}
                  </p>
                  <h3>{t("dispatch.suppliers")}</h3>
                  <Segmented
                    block
                    value={task.supplier}
                    onChange={(supplier) =>
                      update({ supplier: supplier as "A" | "B" })
                    }
                    options={["A", "B"].map((value) => ({
                      value,
                      label: t("dispatch.supplier", { name: value }),
                    }))}
                  />
                  <Card
                    size="small"
                    title={t("dispatch.supplier", { name: task.supplier })}
                  >
                    <Tag>
                      {t(
                        task.confirmed
                          ? "dispatch.sampleReply"
                          : "dispatch.notSent",
                      )}
                    </Tag>
                    <p>
                      {t(
                        task.confirmed
                          ? `dispatch.supplierReply${task.supplier}`
                          : "dispatch.supplierPlaceholder",
                      )}
                    </p>
                  </Card>
                  <h3>{t("dispatch.quotation")}</h3>
                  <p>
                    {t(
                      task.confirmed
                        ? "dispatch.quotationExample"
                        : "dispatch.quotationPlaceholder",
                    )}
                  </p>
                </>
              ) : (
                <>
                  <h3>{t("dispatch.preview")}</h3>
                  <div className={styles.preview}>
                    <Code2 size={30} />
                    <p>{t("dispatch.previewPlaceholder")}</p>
                    <small>{t("dispatch.previewHint")}</small>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Empty description={t("dispatch.selectTask")} />
          )}{" "}
          {task && (
            <details className={styles.demo}>
              <summary>{t("dispatch.demoStates")}</summary>
              <Button size="small" onClick={() => update({ view: "loading" })}>
                {t("dispatch.showLoading")}
              </Button>
              <Button size="small" onClick={() => update({ view: "failed" })}>
                {t("dispatch.showFailure")}
              </Button>
              <Button size="small" onClick={() => update({ view: "ready" })}>
                {t("dispatch.showReady")}
              </Button>
            </details>
          )}
        </section>
      </div>
      <Modal
        title={t("dispatch.create")}
        open={creating}
        onCancel={() => setCreating(false)}
        onOk={() => form.submit()}
        okText={t("dispatch.create")}
        cancelText={t("common.cancel")}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{ role: "purchase" }}
          onFinish={(values) => {
            const item = makeTask(values.role, values.title.trim());
            setTasks((items) => [item, ...items]);
            setSelected(item.id);
            setCreating(false);
            form.resetFields();
          }}
        >
          <Form.Item
            name="title"
            label={t("dispatch.taskTitle")}
            rules={[
              {
                required: true,
                whitespace: true,
                message: t("dispatch.titleRequired"),
              },
            ]}
          >
            <Input autoFocus maxLength={120} />
          </Form.Item>
          <Form.Item name="role" label={t("dispatch.role")}>
            <Radio.Group
              options={["purchase", "software"].map((value) => ({
                value,
                label: t(`dispatch.roles.${value}`),
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </PageShell>
  );
}
