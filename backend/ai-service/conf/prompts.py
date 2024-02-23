DETAILED_SUMMARY_PROMPT = """
文章内容为：
```
{text}
```
你的任务是对以上文章进行总结，尽可能包含文章中所有的观点。总结的长度应该在2500字以内。
你需要使用与原文相同的语言进行回复，不要转换成其他语言。
"""

DETAILED_SUMMARY_REDUCE_PROMPT = """
摘要集合:
```
{text}
```
你的任务是将以上摘要集合提取出来，并用最常用的语言将其提炼成最终的综合摘要，尽可能包含文章中所有的观点。 最终的综合摘要的长度应该在2500字以内。
你需要使用与原文相同的语言进行回复，不要转换成其他语言。
"""

DETAILED_SUMMARY_REFINE_PROMPT = """
文章内容为：
```
{text}
```
你的任务是对以上文章进行总结，尽可能包含文章中所有的观点。总结的长度应该在2500字以内。
我们已经提供了一定程度的现有摘要: {existing_answer}
我们有机会通过下面的更多上下文来完善现有的摘要（仅在需要时）。
如果上下文没有用，则返回原始摘要。
你需要使用与原文相同的语言进行回复，不要转换成其他语言。
"""

SUMMARY_PROMPT = """
Your task is to summarize the most essential parts of an article and write a concise, easy-to-read, and logically coherent abstract. You need to read the entire article carefully, understand the author's viewpoint and arguments, and then select the most important information points to summarize. You can use your own language and style, but make sure to express it clearly and concisely.

Article content is:
```
{text}
```

You need to respond in {lang}.
The length of the summary should be within 80 words.
"""

SUMMARY_REFINE_PROMPT = """
Your task is to summarize the most essential parts of an article and write a concise, easy-to-read, and logically coherent abstract. You need to read the entire article carefully, understand the author's viewpoint and arguments, and then select the most important information points to summarize. You can use your own language and style, but make sure to express it clearly and concisely.

We have provided an existing summary up to a certain point: {existing_answer}
We have the opportunity to refine the existing summary (only if needed) with some more context below.

Article content is:
```
{text}
```

If the context isn't useful, return the original summary.
You need to respond in {lang}.
The length of the summary should be within 80 words.
"""

SUMMARY_REDUCE_PROMPT = """
Your task is to refine the final comprehensive summary based on the known summary set, including as many viewpoints as possible.

Summary set:
```
{text}
```

You need to respond in {lang}.
The length of the summary should be within 80 words.
"""

SUGGESTED_QUESTIONS_PROMPT = """
Your task is to identify the top three questions that readers are most concerned about based on the article's main points. These questions should be answerable by the information presented in the article. Each question should be no more than 50 words in length. You should read the article carefully, paying attention to the author's arguments and evidence, and then choose the most important topics that are likely to be of interest to readers. You can use your own wording, but make sure the questions are clear and concise.

Format for reply:
Q1: xxx
Q2: xxx
Q3: xxx

Article content is:
```
{text}
```

You need to respond in {lang}.
"""

SUGGESTED_QUESTIONS_REDUCE_PROMPT = """
Your task is to pick out the three questions that users care about most based on the list of known users. Don't create new problems. Just give the question, don't answer the question.

Format for reply:
Q1: xxx
Q2: xxx
Q3: xxx

Known question list:
```
{questions}
```

You need to respond in {lang}.
"""

QA_ANSWER_LANG_SYSTEM_PROMPT = """
Follow these two instructions below in all your responses:
1.Use {lang} language only;
2.Translate any other language to the {lang} language whenever possible.
"""

QA_ANSWER_AUTO_LANG_SYSTEM_PROMPT = """
Please adaptively adjust the reply language based on the language used in the user prompt.
"""

QA_SYSTEM_PROMPT = """
You are an AI assistant named Xiao Ming. You can help users with various types of questions, such as information retrieval, language translation, article writing, and summarization based on the prompts given by the user. You can also assist users with reading and information retrieval based on webpage content.
You are a model trained and built by Xiaoming's artificial intelligence team based on a self-developed private generative large model. It has nothing to do with the large models trained by Openai (Open AI), GPT,chatglm, Baidu, Tencent, or the OpenAI team.
you don't have access to information about you own training data or building model or building team or any updates to it. However, you are designed to continuously learn and adapt based on user interactions, so you can improve your responses over time.
"""

WEB_SEARCH_SYSTEM_PROMPT = """
当你需要搜索你不知道的东西或者当你的信息不是最新的时，使用web-search工具
如果需要需要调用工具, 只返回function信息, content中不要返回内容
"""

QA_WITH_CONTEXT_PROMPT = """
Answer the users question.
If you don't know the answer, just say that you don't know, don't try to make up an answer.
----------------
{text}
----------------
Question: {question}
"""

QA_PROMPT = """{question}"""

QA_ANSWER_LANG_PROMPT = """
You need to respond in {lang}.
"""

def get_qa_system_prompt(lang):
    return QA_ANSWER_LANG_SYSTEM_PROMPT + QA_SYSTEM_PROMPT if lang and lang != 'auto' else QA_ANSWER_AUTO_LANG_SYSTEM_PROMPT + QA_SYSTEM_PROMPT

def get_qa_prompt(lang):
    return QA_PROMPT + QA_ANSWER_LANG_PROMPT if lang and lang != 'auto' else QA_PROMPT

def get_qa_with_context_prompt(lang):
    return QA_WITH_CONTEXT_PROMPT + QA_ANSWER_LANG_PROMPT if lang and lang != 'auto' else QA_WITH_CONTEXT_PROMPT

