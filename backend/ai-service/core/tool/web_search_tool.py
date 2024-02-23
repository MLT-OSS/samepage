from typing import Type, List, Dict

from langchain.tools import BaseTool
from langchain.utilities import BingSearchAPIWrapper
from pydantic import BaseModel, Field

from conf import constant


class WebSearchToolInput(BaseModel):
    query: str = Field(..., description="search query. 可以提取成更容易搜索到有效内容的格式, 也可以根据需要使用Bing的高级搜索功能")


class WebSearchTool(BaseTool):
    name: str = "web_search"
    description: str = "A tool for performing a Bing search and extracting snippets and webpages " \
                       "when you need to search for something you don't know or when your information " \
                       "is not up to date. " \
                       "Input should be a search query."

    args_schema: Type[BaseModel] = WebSearchToolInput

    def _run(self, query: str) -> List[Dict[str, str]]:
        return self.run_search(query)

    async def _arun(self, tool_input: str) -> List[Dict[str, str]]:
        raise NotImplementedError()

    @classmethod
    def run_search(cls, query):
        return BingSearchAPIWrapper(
            bing_search_url=constant.BING_SEARCH_URL,
            bing_subscription_key=constant.BING_SUBSCRIPTION_KEY,
            k=constant.WEB_SEARCH_NUM_RESULTS
        ).results(query=query, num_results=5)
