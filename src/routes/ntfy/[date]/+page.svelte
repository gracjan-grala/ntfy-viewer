<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

  let dishes = $state(data.dishData);

  function removeOption(mealIndex: number, mealIndexVertical: number) {
    dishes[mealIndex].splice(mealIndexVertical, 1);
  }
</script>

<svelte:head>
	<title>NTFY Viewer</title>
	<meta name="description" content="NTFY Viewer" />
</svelte:head>

<a
  class="flex justify-center items-center w-full h-full hover:bg-lime-200/50 hover:no-underline"
  href={data.prevDayLink}
>
  <div class="text-7xl text-slate-600">
    ←
  </div>
</a>

<div class="h-full flex flex-initial flex-col">
  <div class="h-full meals-list overflow-scroll">

    <div>
      <h1>Jadłospis {data.date}</h1>
    </div>

    <div>
      {#each Object.values(dishes) as mealOptions, mealIndex}
        <h2 id={data.mealNames[mealIndex]}>
          {data.mealNames[mealIndex]}
        </h2>
        <table class="meals">
          <thead>
            <tr>
              <th></th>
              <th>Nazwa</th>
              <th></th>
              <th class="meal-numerical">Ocena</th>
              <th class="meal-numerical">Białko</th>
              <th class="meal-numerical">Tłuszcze nas.</th>
            </tr>
          </thead>
          <tbody>
            {#each mealOptions as mealOption, mealOptionIndex}
              <tr>
                <td
                  class="remove-button"
                  onclick={() => removeOption(mealIndex + 1, mealOptionIndex)}
                >
                  <span>🗑️</span>
                </td>
                <td class="meal-name">
                  {mealOption.name}
                </td>
                <td class="meal-image">
                  <a href={mealOption.link} target="_blank" rel="noopener noreferrer">
                    <img
                      alt={mealOption.name.substr(0, mealOption.name.indexOf(' '))}
                      class="img-main"
                      src={mealOption.imgSquareLink}
                    />
                    <img
                      alt={mealOption.name.substr(0, mealOption.name.indexOf(' '))}
                      class="img-alternative"
                      src={mealOption.imgRealLink}
                    />
                  </a>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${mealOption.rating.color}`}>
                    {mealOption.rating.value.toFixed(2)}
                  </div>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${mealOption.protein.color}`}>
                    {Math.round(mealOption.protein.value)}
                  </div>
                </td>
                <td class="meal-numerical">
                  <div class="meal-numerical-color" style={`background: ${mealOption.saturatedFat.color}`}>
                    {Math.round(mealOption.saturatedFat.value)}
                  </div>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      {/each}
    </div>

  </div>
</div>

<a
  class="flex justify-center items-center w-full h-full hover:bg-lime-200/50 hover:no-underline"
  href={data.nextDayLink}
>
  <div class="text-7xl text-slate-600">
    →
  </div>
</a>

<style>
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  h1 {
    font-size: 2.5rem;
    margin: 2rem 0;
  }

  h2 {
    text-align: center;
    font-size: 2rem;
    font-weight: bold;
    margin-bottom: 1rem;
  }

  .meals-list {
    width: 64rem;
  }

  .meals {
    margin-bottom: 5rem;

    .remove-button {
      cursor: pointer;
      padding: 0 .5em;

      span {
        visibility: hidden;
      }
    }

    tbody {
      tr {
        &:nth-child(odd) {
          background: theme('colors.gray.100 / 0.4');
        }

        &:nth-child(even) {
          background: theme('colors.gray.200 / 0.4');
        }
      }

      tr:hover {
        background: theme('colors.sky.300 / 0.2');

        .remove-button {
          background: theme('colors.rose.200 / 0.8');

          span {
            visibility: visible;
          }
        }
      }
    }

    th, td {
      text-align: center;
    }

    .meal-name {
      text-align: left;
      max-width: 450px;
      padding: 0 .5em;
    }

    .meal-numerical {
      width: 128px;
    }

    .meal-numerical-color {
      padding: 20px 0;
    }

    .meal-image {
      img {
        width: 128px;
      }

      .img-alternative {
        display: none;
        height: 128px;
        object-fit: cover;
        object-position: 50% 35%;
      }

      &:hover {
        .img-main {
          display: none;
        }

        .img-alternative {
          display: block;
        }
      }
    }
  }
</style>
