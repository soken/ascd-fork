import React from 'react'
import { connectRefinementList } from 'react-instantsearch-dom'

const RefinementList = ({ items, refine, searchForItems }) => (
  <div className={`ais-RefinementList`}>
    <ul className={`ais-RefinementList-list`}>
      <li className={`ais-RefinementList-item`}>
        <input
          type='search'
          onChange={(event) => searchForItems(event.currentTarget.value)}
        />
      </li>
      {items.map((item) => (
        <li key={item.label} className={`ais-RefinementList-item`}>
          <label className={`ais-RefinementList-label`}>
            <input
              type='checkbox'
              checked={item.isRefined}
              className={`ais-RefinementList-checkbox`}
              onClick={() => {
                refine(item.value)
              }}
            />
            <span className={`ais-RefinementList-labelText`}>{item.label}</span>
            <span className={`ais-RefinementList-count`}>{item.count}</span>
          </label>
        </li>
      ))}
    </ul>
  </div>
)

export const CustomRefinementList = connectRefinementList(RefinementList)
